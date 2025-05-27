/**
 * ZVoiceInterface.js
 * 
 * Processes voice commands and converts them to intents in the Birlik Platform.
 * This component is responsible for:
 * - Processing voice commands from users
 * - Converting speech to text
 * - Extracting intents from voice commands
 * - Supporting multiple languages
 * - Providing voice responses
 */

const { v4: uuidv4 } = require('uuid');
const winston = require('winston');
const { OpenAI } = require('langchain/llms/openai');
const { PromptTemplate } = require('langchain/prompts');
const axios = require('axios');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'z-voice-interface' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'z-voice-interface.log' }),
  ],
});

class ZVoiceInterface {
  constructor() {
    this.voiceCommands = new Map();
    this.model = new OpenAI({ 
      temperature: 0.2,
      modelName: "gpt-4",
    });
    this.intentPrompt = new PromptTemplate({
      template: `You are an AI assistant for the Birlik Platform.
      
      User voice command: {text}
      User language: {language}
      
      Based on this voice command, determine:
      1. The user's intent
      2. The service they want to interact with
      3. The specific operation they want to perform
      4. Any parameters for this operation
      
      Respond in JSON format with the following structure:
      {
        "intent_type": "banking|real_estate|automotive|logistics|exchange|marketplace|islamic_banking|delivery|taxi|dao|identity|workforce|system|voice",
        "content": {
          "service": "service_name",
          "operation": "operation_name",
          "parameters": {
            "param1": "value1",
            "param2": "value2"
          }
        }
      }`,
      inputVariables: ["text", "language"],
    });
    
    this.supportedLanguages = [
      'en', // English
      'ru', // Russian
      'kk', // Kazakh
      'uz', // Uzbek
      'tr', // Turkish
      'ar', // Arabic
      'zh', // Chinese
      'es', // Spanish
      'fr', // French
      'de', // German
    ];
  }

  /**
   * Process a voice command
   * @param {string} userId - The user ID
   * @param {Buffer} audioData - The audio data
   * @param {string} language - The language code
   * @returns {Promise<Object>} - The processed voice command
   */
  async processVoiceCommand(userId, audioData, language = 'en') {
    try {
      logger.info(`Processing voice command for user ${userId}`);
      
      const commandId = uuidv4();
      const voiceCommand = {
        id: commandId,
        user_id: userId,
        audio_data: audioData,
        text: null,
        language,
        created_at: new Date().toISOString(),
        processed: false,
        intent: null,
      };
      
      this.voiceCommands.set(commandId, voiceCommand);
      
      const text = await this.speechToText(audioData, language);
      voiceCommand.text = text;
      
      logger.info(`Speech to text result: "${text}"`);
      
      const intent = await this.extractIntent(text, language);
      voiceCommand.intent = intent;
      voiceCommand.processed = true;
      
      this.voiceCommands.set(commandId, voiceCommand);
      
      logger.info(`Voice command processed: ${commandId}`);
      
      return voiceCommand;
    } catch (error) {
      logger.error(`Error processing voice command: ${error.message}`);
      throw new Error(`Failed to process voice command: ${error.message}`);
    }
  }

  /**
   * Convert speech to text
   * @param {Buffer} audioData - The audio data
   * @param {string} language - The language code
   * @returns {Promise<string>} - The transcribed text
   */
  async speechToText(audioData, language) {
    try {
      
      logger.info(`Converting speech to text for language: ${language}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponses = {
        'en': 'Transfer 100 dollars to my savings account',
        'ru': 'Перевести 100 долларов на мой сберегательный счет',
        'kk': 'Жинақ шотыма 100 доллар аудару',
        'uz': 'Jamg\'arma hisobimga 100 dollar o\'tkazish',
        'tr': 'Tasarruf hesabıma 100 dolar aktar',
        'ar': 'حول 100 دولار إلى حساب التوفير الخاص بي',
        'zh': '将100美元转入我的储蓄账户',
        'es': 'Transferir 100 dólares a mi cuenta de ahorros',
        'fr': 'Transférer 100 dollars sur mon compte d\'épargne',
        'de': 'Überweise 100 Dollar auf mein Sparkonto',
      };
      
      return mockResponses[language] || mockResponses['en'];
    } catch (error) {
      logger.error(`Error in speech to text: ${error.message}`);
      throw new Error(`Failed to convert speech to text: ${error.message}`);
    }
  }

  /**
   * Extract intent from text
   * @param {string} text - The text to extract intent from
   * @param {string} language - The language code
   * @returns {Promise<Object>} - The extracted intent
   */
  async extractIntent(text, language) {
    try {
      logger.info(`Extracting intent from text: "${text}"`);
      
      const formattedPrompt = await this.intentPrompt.format({
        text,
        language,
      });
      
      const response = await this.model.call(formattedPrompt);
      
      const intentData = JSON.parse(response);
      
      const intent = {
        id: uuidv4(),
        user_id: null, // Will be set by the caller
        intent_type: intentData.intent_type,
        content: intentData.content,
        created_at: new Date().toISOString(),
        context: { source: 'voice' },
        priority: 1,
        language,
      };
      
      logger.info(`Extracted intent: ${intent.intent_type}`);
      
      return intent;
    } catch (error) {
      logger.error(`Error extracting intent: ${error.message}`);
      throw new Error(`Failed to extract intent: ${error.message}`);
    }
  }

  /**
   * Get voice command by ID
   * @param {string} commandId - The command ID
   * @returns {Object|null} - The voice command or null if not found
   */
  getVoiceCommand(commandId) {
    return this.voiceCommands.get(commandId) || null;
  }

  /**
   * Get user voice commands
   * @param {string} userId - The user ID
   * @param {number} limit - The maximum number of commands to return
   * @returns {Array} - The user's voice commands
   */
  getUserVoiceCommands(userId, limit = 10) {
    const commands = [];
    
    for (const command of this.voiceCommands.values()) {
      if (command.user_id === userId) {
        commands.push(command);
      }
    }
    
    return commands
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  }

  /**
   * Generate voice response
   * @param {string} text - The text to convert to speech
   * @param {string} language - The language code
   * @returns {Promise<Buffer>} - The audio data
   */
  async textToSpeech(text, language = 'en') {
    try {
      logger.info(`Converting text to speech: "${text}" in language: ${language}`);
      
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return Buffer.from('mock-audio-data');
    } catch (error) {
      logger.error(`Error in text to speech: ${error.message}`);
      throw new Error(`Failed to convert text to speech: ${error.message}`);
    }
  }

  /**
   * Detect language from text
   * @param {string} text - The text to detect language from
   * @returns {Promise<string>} - The detected language code
   */
  async detectLanguage(text) {
    try {
      logger.info(`Detecting language for text: "${text}"`);
      
      
      const languagePatterns = {
        'ru': /[а-яА-Я]/,
        'ar': /[\u0600-\u06FF]/,
        'zh': /[\u4E00-\u9FFF]/,
        'kk': /[әғқңөұүі]/i,
        'uz': /[ʻʼ'']/,
        'tr': /[ğıöüçş]/i,
      };
      
      for (const [lang, pattern] of Object.entries(languagePatterns)) {
        if (pattern.test(text)) {
          return lang;
        }
      }
      
      return 'en';
    } catch (error) {
      logger.error(`Error detecting language: ${error.message}`);
      return 'en'; // Default to English on error
    }
  }

  /**
   * Process a text command (for testing or when voice is not available)
   * @param {string} userId - The user ID
   * @param {string} text - The text command
   * @returns {Promise<Object>} - The processed command
   */
  async processTextCommand(userId, text) {
    try {
      logger.info(`Processing text command for user ${userId}: "${text}"`);
      
      const language = await this.detectLanguage(text);
      
      const commandId = uuidv4();
      const command = {
        id: commandId,
        user_id: userId,
        audio_data: null,
        text,
        language,
        created_at: new Date().toISOString(),
        processed: false,
        intent: null,
      };
      
      const intent = await this.extractIntent(text, language);
      command.intent = intent;
      command.processed = true;
      
      this.voiceCommands.set(commandId, command);
      
      logger.info(`Text command processed: ${commandId}`);
      
      return command;
    } catch (error) {
      logger.error(`Error processing text command: ${error.message}`);
      throw new Error(`Failed to process text command: ${error.message}`);
    }
  }
}

const zVoiceInterface = new ZVoiceInterface();
module.exports = zVoiceInterface;
