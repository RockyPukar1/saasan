import { Router } from 'express';
import { CampaignController } from '../controllers/CampaignController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const campaignController = new CampaignController();

// Campaign Dashboard
router.get('/dashboard', authenticateToken, (req, res) => {
  campaignController.getCampaignDashboard(req, res);
});

// Voter Registration Routes
router.post('/register-voter', authenticateToken, (req, res) => {
  campaignController.registerVoter(req, res);
});

router.get('/voter-registrations', authenticateToken, (req, res) => {
  campaignController.getVoterRegistrations(req, res);
});

router.put('/voter-registrations/:id/verify', authenticateToken, (req, res) => {
  campaignController.verifyVoterRegistration(req, res);
});

// Voter Intent Survey Routes
router.post('/voter-survey', authenticateToken, (req, res) => {
  campaignController.submitVoterSurvey(req, res);
});

router.get('/voter-surveys', authenticateToken, (req, res) => {
  campaignController.getVoterSurveys(req, res);
});

// Election Candidates Routes
router.get('/candidates/constituency/:constituencyId', (req, res) => {
  campaignController.getCandidatesByConstituency(req, res);
});

router.get('/candidates/compare/:candidate1Id/:candidate2Id', authenticateToken, (req, res) => {
  campaignController.compareCandidates(req, res);
});

// Voting System Routes
router.get('/voting-sessions/active', (req, res) => {
  campaignController.getActiveVotingSessions(req, res);
});

router.post('/vote', authenticateToken, (req, res) => {
  campaignController.castVote(req, res);
});

router.get('/voting-results/:sessionId', (req, res) => {
  campaignController.getVotingResults(req, res);
});

// Campaign Analytics Routes
router.get('/analytics', authenticateToken, (req, res) => {
  campaignController.getCampaignAnalytics(req, res);
});

export default router;
