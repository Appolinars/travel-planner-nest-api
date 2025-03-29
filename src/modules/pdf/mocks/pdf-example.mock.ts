export const pdfMockData = {
  reportDate: new Date().toLocaleDateString(),
  executiveSummary:
    'NVIDIA has had an exceptional quarter with a strong performance in our gaming, data center, and automotive sectors. Our revenue has seen a significant increase, driven by high demand for our latest GPU products.',
  financialSummary: {
    Q1: { revenue: '$10,000', expenses: '$5,000', netProfit: '$5,000' },
    Q2: { revenue: '$12,000', expenses: '$6,000', netProfit: '$6,000' },
    Q3: { revenue: '$15,000', expenses: '$7,000', netProfit: '$8,000' },
    Q4: { revenue: '$20,000', expenses: '$10,000', netProfit: '$10,000' },
  },
  newProducts: {
    Q1: [
      'H100',
      'H100 features fourth-generation Tensor Cores and a Transformer Engine with FP8 precision that provides up to 4X faster training over the prior generation for GPT-3 (175B) models. The combination of fourth-generation NVLink, which offers 900 gigabytes per second (GB/s) of GPU-to-GPU interconnect; NDR Quantum-2 InfiniBand networking, which accelerates communication by every GPU across nodes; PCIe Gen5; and NVIDIA Magnum IO™ software delivers efficient scalability from small enterprise systems to massive, unified GPU clusters，Deploying H100 GPUs at data center scale delivers outstanding performance and brings the next generation of exascale high-performance computing (HPC) and trillion-parameter AI within the reach of all researchers.',
    ],
    Q2: [
      'NVIDIA H200 ',
      'The NVIDIA H200 Tensor Core GPU supercharges generative AI and high-performance computing (HPC) workloads with game-changing performance and memory capabilities. As the first GPU with HBM3e, the H200’s larger and faster memory fuels the acceleration of generative AI and large language models (LLMs) while advancing scientific computing for HPC workloads.',
    ],
    Q3: [
      'NVIDIA GB200 NVL2',
      'The NVIDIA GB200 NVL2 platform brings the new era of computing to every data center, delivering unparalleled performance for mainstream large language model (LLM) inference, vector database search, and data processing through 2 Blackwell GPUs and 2 Grace GPUs. With its scale-out, single node NVIDIA MGX™ architecture, its design enables a wide variety of system designs and networking options to seamlessly integrate accelerated computing into existing data center infrastructure.',
    ],
    Q4: [
      'gb200-nvl72',
      'GB200 NVL72 connects 36 Grace CPUs and 72 Blackwell GPUs in a rack-scale design. The GB200 NVL72 is a liquid-cooled, rack-scale solution that boasts a 72-GPU NVLink domain that acts as a single massive GPU and delivers 30X faster real-time trillion-parameter LLM inference.The GB200 Grace Blackwell Superchip is a key component of the NVIDIA GB200 NVL72, connecting two high-performance NVIDIA Blackwell Tensor Core GPUs and an NVIDIA Grace CPU using the NVIDIA® NVLink®-C2C interconnect to the two Blackwell GPUs.',
    ],
  },
  marketTrends:
    'The market for GPUs continues to grow, with increased demand from gamers, AI researchers, and data centers. Our market share has expanded, and we are well-positioned to continue this growth.',
  researchAndDevelopment:
    'We have invested heavily in R&D this quarter, focusing on AI, machine learning, and next-generation gaming technologies. Our new research lab in Silicon Valley is expected to produce breakthrough innovations.',
  strategicInitiatives:
    'Our strategic initiatives include expanding our partnerships with major tech companies, exploring new markets, and enhancing our product offerings with cutting-edge technology.',
  conclusion:
    "<span style='color:red'>Overall:</span>this quarter has been highly productive and we look forward to sustaining this momentum in the coming quarters. We remain committed to delivering value to our shareholders through continuous innovation and strategic growth.",
};
