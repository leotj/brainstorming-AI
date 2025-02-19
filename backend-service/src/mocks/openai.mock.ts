export class OpenAIService {
  getChatCompletionResponses() {
    return {
      choices: [
        {
          content_filter_results: {
            hate: {
              filtered: false,
              severity: 'safe',
            },
            protected_material_code: {
              filtered: false,
              detected: false,
            },
            protected_material_text: {
              filtered: false,
              detected: false,
            },
            self_harm: {
              filtered: false,
              severity: 'safe',
            },
            sexual: {
              filtered: false,
              severity: 'safe',
            },
            violence: {
              filtered: false,
              severity: 'safe',
            },
          },
          finish_reason: 'length',
          index: 0,
          logprobs: null,
          message: {
            content:
              "Stock investment is a popular way to grow wealth over time, but it comes with its own set of risks and opportunities. Below are multiple perspectives to help you better understand stock investments:\n\n---\n\n### 1. **What is Stock Investment?**\nStock investment involves purchasing shares of a company in the stock market. When you buy a stock, you are essentially buying a small ownership stake in that company. If the company's value grows, the value of your shares increases, and you can profit by selling them at a higher price. Additionally, some companies pay dividends, which are regular cash payments to shareholders.\n\n---\n\n### 2. **Benefits of Stock Investment**\n- **Wealth Growth Over Time:** Historically, the stock market has delivered higher long-term returns compared to other investment options like bonds or savings accounts.\n- **Dividend Income:** Some companies pay dividends, providing a steady income stream.\n- **Liquidity:** Stocks are relatively easy to buy and sell compared to other investments like real estate.\n- **Ownership in",
            refusal: null,
            role: 'assistant',
          },
        },
        {
          content_filter_results: {
            hate: {
              filtered: false,
              severity: 'safe',
            },
            protected_material_code: {
              filtered: false,
              detected: false,
            },
            protected_material_text: {
              filtered: false,
              detected: false,
            },
            self_harm: {
              filtered: false,
              severity: 'safe',
            },
            sexual: {
              filtered: false,
              severity: 'safe',
            },
            violence: {
              filtered: false,
              severity: 'safe',
            },
          },
          finish_reason: 'length',
          index: 1,
          logprobs: null,
          message: {
            content:
              "Stock investment is a popular way to grow wealth over time, but it comes with its own set of risks and rewards. Here's an overview of key concepts, strategies, benefits, and challenges associated with investing in stocks:\n\n---\n\n### **What Is Stock Investment?**\nStock investment involves purchasing shares of a company, which represent partial ownership in that company. When you invest in stocks, you aim to benefit from:\n1. **Capital Appreciation**: The increase in the value of the stock over time.\n2. **Dividends**: Periodic payments made by some companies to their shareholders.\n\n---\n\n### **Why Invest in Stocks?**\n1. **Potential for High Returns**: Historically, the stock market has outperformed many other asset classes (e.g., bonds, real estate) over long periods.\n2. **Dividend Income**: Some companies distribute a portion of their profits to shareholders.\n3. **Liquidity**: Stocks are easy to buy and sell on the stock market, making them a",
            refusal: null,
            role: 'assistant',
          },
        },
        {
          content_filter_results: {
            hate: {
              filtered: false,
              severity: 'safe',
            },
            protected_material_code: {
              filtered: false,
              detected: false,
            },
            protected_material_text: {
              filtered: false,
              detected: false,
            },
            self_harm: {
              filtered: false,
              severity: 'safe',
            },
            sexual: {
              filtered: false,
              severity: 'safe',
            },
            violence: {
              filtered: false,
              severity: 'safe',
            },
          },
          finish_reason: 'length',
          index: 2,
          logprobs: null,
          message: {
            content:
              'Stock investment is the process of buying and holding shares of publicly traded companies with the goal of earning a return on your capital. It is one of the most common ways to grow wealth over time, but also comes with risks. Below are various perspectives to consider when it comes to stock investing:\n\n---\n\n### **1. Why Invest in Stocks?**\n- **Pros:**\n  - **Potential for High Returns:** Historically, the stock market has outperformed other asset classes like bonds, gold, and real estate over the long term.\n  - **Ownership in Companies:** By purchasing shares, you own a small piece of the company and can benefit from its growth.\n  - **Liquidity:** Stocks are easily bought and sold, making them more liquid than other investments like real estate.\n  - **Dividend Income:** Some stocks pay dividends, offering regular income on top of potential capital gains.\n  - **Hedge Against Inflation:** Stocks generally outperform inflation over the long run.\n\n- **Cons:**\n  -',
            refusal: null,
            role: 'assistant',
          },
        },
      ],
      created: 1739937996,
      id: 'chatcmpl-B2Ve0Wv5YZqFCEmOjOkF2nFVm4CTy',
      model: 'gpt-4o-2024-11-20',
      object: 'chat.completion',
      prompt_filter_results: [
        {
          prompt_index: 0,
          content_filter_results: {
            hate: {
              filtered: false,
              severity: 'safe',
            },
            jailbreak: {
              filtered: false,
              detected: false,
            },
            self_harm: {
              filtered: false,
              severity: 'safe',
            },
            sexual: {
              filtered: false,
              severity: 'safe',
            },
            violence: {
              filtered: false,
              severity: 'safe',
            },
          },
        },
      ],
      system_fingerprint: 'fp_f3927aa00d',
      usage: {
        completion_tokens: 600,
        completion_tokens_details: {
          accepted_prediction_tokens: 0,
          audio_tokens: 0,
          reasoning_tokens: 0,
          rejected_prediction_tokens: 0,
        },
        prompt_tokens: 24,
        prompt_tokens_details: {
          audio_tokens: 0,
          cached_tokens: 0,
        },
        total_tokens: 624,
      },
    };
  }
}
