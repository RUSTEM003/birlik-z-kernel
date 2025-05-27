/**
 * API Router Index
 * 
 * This file exports all API routers for the Z-KERNEL architecture.
 */

const express = require('express');
const router = express.Router();

const exchangeRouter = require('./exchange');
const realEstateRouter = require('./real_estate');
const vehiclesRouter = require('./vehicles');
const daoRouter = require('./dao');
const logisticsRouter = require('./logistics');
const bankRouter = require('./bank');
const mapRouter = require('./map');
const appRouter = require('./app');
const marketRouter = require('./market');
const islamRouter = require('./islam');
const identityRouter = require('./identity');
const workforceRouter = require('./workforce');

const metaverseRouter = require('./metaverse');
const quantumFinanceRouter = require('./quantum-finance');
const spaceEconomyRouter = require('./space-economy');
const climateRouter = require('./climate');
const healthRouter = require('./health');

router.use('/exchange', exchangeRouter);
router.use('/real_estate', realEstateRouter);
router.use('/vehicles', vehiclesRouter);
router.use('/dao', daoRouter);
router.use('/logistics', logisticsRouter);
router.use('/bank', bankRouter);
router.use('/map', mapRouter);
router.use('/app', appRouter);
router.use('/market', marketRouter);
router.use('/islam', islamRouter);
router.use('/identity', identityRouter);
router.use('/workforce', workforceRouter);

router.use('/metaverse', metaverseRouter);
router.use('/quantum-finance', quantumFinanceRouter);
router.use('/space-economy', spaceEconomyRouter);
router.use('/climate', climateRouter);
router.use('/health', healthRouter);

module.exports = router;
