export interface PreBuiltOption {
  id: string;
  response: string;
}

export interface MockCategory {
  header: string;
  options: PreBuiltOption[];
}

export const mockResponses: Record<string, MockCategory> = {
  // Level 1: User is just browsing
  browsing: {
    header: "No problem! Feel free to look around. Need anything?",
    options: [
      { id: '1', response: "Actually, I do have a question" },
      { id: '2', response: "What are your most popular features?" },
      { id: '3', response: "That's all, thanks!" },
    ]
  },
  // Level 1: User needs support
  support: {
    header: "I'd be happy to help! What kind of support do you need?",
    options: [
      { id: '1', response: "I have a billing question" },
      { id: '2', response: "I'm having a technical issue" },
      { id: '3', response: "I need to reset my password" },
      { id: '4', response: "I'd like to speak to a representative" },
    ]
  },
  // Level 1: User asking about pricing
  pricing: {
    header: "Great question! What would you like to know about pricing?",
    options: [
      { id: '1', response: "What plans do you offer?" },
      { id: '2', response: "Is there a free trial?" },
      { id: '3', response: "Do you have enterprise pricing?" },
      { id: '4', response: "How does billing work?" },
    ]
  },
  // Level 2: Support - Billing
  billing: {
    header: "I can help with billing! What's your question?",
    options: [
      { id: '1', response: "I need to update my payment method" },
      { id: '2', response: "I have a charge I don't recognize" },
      { id: '3', response: "I want to cancel my subscription" },
      { id: '4', response: "Go back to support options" },
    ]
  },
  // Level 2: Support - Technical
  technical: {
    header: "Let's troubleshoot! What's happening?",
    options: [
      { id: '1', response: "The app is running slowly" },
      { id: '2', response: "I'm getting an error message" },
      { id: '3', response: "A feature isn't working" },
      { id: '4', response: "Go back to support options" },
    ]
  },
  // Level 2: Support - Password
  password: {
    header: "No problem! I'll help you reset your password.",
    options: [
      { id: '1', response: "Send me a reset email" },
      { id: '2', response: "I'm not receiving the reset email" },
      { id: '3', response: "Go back to support options" },
    ]
  },
  // Level 2: Support - Representative
  representative: {
    header: "I'll connect you with our team!",
    options: [
      { id: '1', response: "Schedule a call" },
      { id: '2', response: "Start a live chat" },
      { id: '3', response: "Send an email instead" },
      { id: '4', response: "Go back to support options" },
    ]
  },
  // Level 2: Pricing - Plans
  plans: {
    header: "We offer three plans: Basic, Pro, and Enterprise.",
    options: [
      { id: '1', response: "Tell me about the Basic plan" },
      { id: '2', response: "Tell me about the Pro plan" },
      { id: '3', response: "Tell me about Enterprise" },
      { id: '4', response: "Go back to pricing options" },
    ]
  },
  // Level 2: Pricing - Trial
  trial: {
    header: "Yes! We offer a 14-day free trial with full access.",
    options: [
      { id: '1', response: "Start my free trial" },
      { id: '2', response: "What happens after the trial?" },
      { id: '3', response: "Go back to pricing options" },
    ]
  },
  // Ending/Thank you
  thanks: {
    header: "Thanks for stopping by! Anything else I can help with?",
    options: [
      { id: '1', response: "Actually, I have another question" },
      { id: '2', response: "No, that's everything!" },
    ]
  },
  // Final goodbye
  goodbye: {
    header: "Great talking with you! Have a wonderful day! 👋",
    options: [
      { id: '1', response: "Start a new conversation" },
    ]
  },
  // Start/Reset - mirrors initial options
  start: {
    header: "Hi! What can I help you with?",
    options: [
      { id: '1', response: "I'm just browsing, thanks for asking." },
      { id: '2', response: "I need support with my account." },
      { id: '3', response: "Tell me about your pricing." },
    ]
  },
  // Default fallback
  default: {
    header: "Thanks for your message! How can I help further?",
    options: [
      { id: '1', response: "I need support with my account" },
      { id: '2', response: "Tell me about your pricing" },
      { id: '3', response: "That's all I needed, thanks!" },
    ]
  }
};

/**
 * Matches a user message to the appropriate mock response category
 */
export function matchMessageToCategory(message: string): MockCategory {
  const messageText = message.toLowerCase();
  
  // Level 1 matches
  if (messageText.includes('browsing') || messageText.includes('just looking')) {
    return mockResponses.browsing;
  } else if (messageText.includes('pricing') || messageText.includes('cost') || messageText.includes('price')) {
    return mockResponses.pricing;
  } else if (messageText.includes('support') || messageText.includes('help') || messageText.includes('account')) {
    return mockResponses.support;
  }
  // Level 2: Support sub-options
  else if (messageText.includes('billing') || messageText.includes('payment') || messageText.includes('charge')) {
    return mockResponses.billing;
  } else if (messageText.includes('technical') || messageText.includes('issue') || messageText.includes('error')) {
    return mockResponses.technical;
  } else if (messageText.includes('password') || messageText.includes('reset')) {
    return mockResponses.password;
  } else if (messageText.includes('representative') || messageText.includes('speak') || messageText.includes('someone')) {
    return mockResponses.representative;
  }
  // Level 2: Pricing sub-options
  else if (messageText.includes('plans') || messageText.includes('offer')) {
    return mockResponses.plans;
  } else if (messageText.includes('trial') || messageText.includes('free')) {
    return mockResponses.trial;
  }
  // Endings and restarts
  else if (messageText.includes('no,') && messageText.includes('everything')) {
    return mockResponses.goodbye;
  } else if (messageText.includes('start') && messageText.includes('new')) {
    return mockResponses.start;
  } else if (messageText.includes('thanks') || messageText.includes('that\'s all')) {
    return mockResponses.thanks;
  } else if (messageText.includes('question') || messageText.includes('another')) {
    return mockResponses.default;
  }

  return mockResponses.default;
}

