/**
 * Z-KERNEL Core Components
 * 
 * This file exports all the core components of the Z-KERNEL architecture.
 */

const zAgentEngine = require('./ZAgentEngine');
const daoIntentRouter = require('./DAOIntentRouter');
const xpCompiler = require('./XPCompiler');
const missionTracer = require('./MissionTracer');
const zVoiceInterface = require('./ZVoiceInterface');

module.exports = {
  zAgentEngine,
  daoIntentRouter,
  xpCompiler,
  missionTracer,
  zVoiceInterface,
};
