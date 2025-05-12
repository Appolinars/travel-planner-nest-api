import { Inject, Injectable } from '@nestjs/common';
import Bottleneck from 'bottleneck';
import tokenizer from 'gpt-tokenizer';
import { ChatMessage } from 'gpt-tokenizer/cjs/GptEncoding';
import OpenAI from 'openai';
import {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';
import { Stream } from 'openai/streaming';

import { BottleneckService } from '../bottleneck/bottleneck.service';

@Injectable()
export class OpenAIService {
  private readonly modelName = 'gpt-4.1-nano' as const;
  private readonly tokenLimit = 30000 as const;
  private readonly limiter: Bottleneck;

  constructor(
    @Inject('OpenAI') private readonly gpt: OpenAI,
    bottleneckService: BottleneckService,
  ) {
    // 30,000 tokens per 70 seconds, with a minimum time of 300ms between requests
    this.limiter = bottleneckService.build('GPT_LIMITER', {
      reservoir: 30000,
      reservoirRefreshAmount: 30000,
      reservoirRefreshInterval: 1000 * 70,
      minTime: 300,
    });
  }

  async sendStreaming(
    messages: ChatMessage[],
    systemMessage?: ChatMessage,
    params: Omit<
      ChatCompletionCreateParamsBase,
      'model' | 'stream' | 'messages'
    > = {},
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    const { messages: messagesToSend, totalTokens } =
      this.reduceContextToFitLimits(messages, systemMessage);
    if (totalTokens > this.tokenLimit || !messagesToSend.length) {
      const error = new Error('Total tokens exceed limit');
      throw error;
    }

    return this.limiter.schedule(
      { weight: Math.min(totalTokens, this.tokenLimit) },
      () =>
        this.gpt.chat.completions.create({
          model: this.modelName,
          messages: messagesToSend as ChatCompletionMessageParam[],
          stream: true,
          ...params,
        }),
    );
  }

  async sendNonStreaming(
    messages: ChatMessage[],
    systemMessage?: ChatMessage,
    params: Omit<
      ChatCompletionCreateParamsBase,
      'model' | 'stream' | 'messages'
    > = {},
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    const { messages: messagesToSend, totalTokens } =
      this.reduceContextToFitLimits(messages, systemMessage);
    if (totalTokens > this.tokenLimit || !messagesToSend.length) {
      const error = new Error('Total tokens exceed limit');
      throw error;
    }

    return this.limiter.schedule(
      { weight: Math.min(totalTokens, this.tokenLimit) },
      () =>
        this.gpt.chat.completions.create({
          model: this.modelName,
          messages: messagesToSend as ChatCompletionMessageParam[],
          stream: false,
          ...params,
        }),
    );
  }

  reduceContextToFitLimits(
    messages: ChatMessage[],
    systemMessage?: ChatMessage,
  ) {
    const result: ChatMessage[] = [];
    let totalTokens = 1000; // Reserve tokens for response

    if (systemMessage) {
      const tokens = tokenizer.encodeChat([systemMessage], 'gpt-4o-mini'); // tokenizer does not support model name gpt-4.1-nano
      totalTokens = tokens.length;
    }

    for (const message of messages.reverse()) {
      const tokens = tokenizer.encodeChat([message], 'gpt-4o-mini');
      const tokenSum = totalTokens + tokens.length;

      if (tokenSum <= this.tokenLimit) {
        result.push(message);
      } else if (message.role === 'assistant' || message.role === 'system') {
        result.pop();
        break;
      }

      totalTokens = tokenSum;
    }

    result.reverse();
    if (systemMessage) result.unshift(systemMessage);

    return { messages: result, totalTokens };
  }
}
