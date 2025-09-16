import { Request, Response } from 'express';
import { CampaignService } from '../services/campaignService';
import { formatBilingualResponse, getLanguageFromRequest } from '../lib/bilingual';

const campaignService = new CampaignService();

export class CampaignController {
  // Voter Registration Endpoints
  async registerVoter(req: Request, res: Response): Promise<void> {
    try {
      const { userId, constituencyId, wardId, registrationNumber } = req.body;
      
      const registration = await campaignService.registerVoter({
        userId,
        constituencyId,
        wardId,
        registrationNumber,
        registrationDate: new Date(),
        verificationStatus: 'pending'
      });

      res.status(201).json({
        success: true,
        data: registration,
        message: 'Voter registration submitted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register voter'
      });
    }
  }

  async getVoterRegistrations(req: Request, res: Response): Promise<void> {
    try {
      const { constituencyId, userId } = req.query;
      const language = getLanguageFromRequest(req);
      
      const registrations = await campaignService.getVoterRegistrations(
        constituencyId ? parseInt(constituencyId as string) : undefined,
        userId ? parseInt(userId as string) : undefined
      );

      const formattedRegistrations = registrations.map(registration => 
        formatBilingualResponse(registration, language)
      );

      res.json({
        success: true,
        data: formattedRegistrations,
        message: 'Voter registrations retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve voter registrations'
      });
    }
  }

  async verifyVoterRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      const registration = await campaignService.verifyVoterRegistration(
        parseInt(id),
        status,
        notes
      );

      res.json({
        success: true,
        data: registration,
        message: 'Voter registration verification updated'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify voter registration'
      });
    }
  }

  // Voter Intent Survey Endpoints
  async submitVoterSurvey(req: Request, res: Response): Promise<void> {
    try {
      const {
        userId,
        constituencyId,
        returnIntent,
        returnReason,
        votingIntent,
        preferredCandidateId,
        concerns,
        suggestions
      } = req.body;
      
      const survey = await campaignService.submitVoterSurvey({
        userId,
        constituencyId,
        returnIntent,
        returnReason,
        votingIntent,
        preferredCandidateId,
        concerns,
        suggestions,
        surveyDate: new Date()
      });

      res.status(201).json({
        success: true,
        data: survey,
        message: 'Voter intent survey submitted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit voter survey'
      });
    }
  }

  async getVoterSurveys(req: Request, res: Response): Promise<void> {
    try {
      const { constituencyId, userId } = req.query;
      const language = getLanguageFromRequest(req);
      
      const surveys = await campaignService.getVoterSurveys(
        constituencyId ? parseInt(constituencyId as string) : undefined,
        userId ? parseInt(userId as string) : undefined
      );

      const formattedSurveys = surveys.map(survey => 
        formatBilingualResponse(survey, language)
      );

      res.json({
        success: true,
        data: formattedSurveys,
        message: 'Voter surveys retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve voter surveys'
      });
    }
  }

  // Election Candidates Endpoints
  async getCandidatesByConstituency(req: Request, res: Response): Promise<void> {
    try {
      const { constituencyId } = req.params;
      const { electionType = 'federal' } = req.query;
      const language = getLanguageFromRequest(req);
      
      const candidates = await campaignService.getCandidatesByConstituency(
        parseInt(constituencyId),
        electionType as 'federal' | 'provincial'
      );

      const formattedCandidates = candidates.map(candidate => 
        formatBilingualResponse(candidate, language)
      );

      res.json({
        success: true,
        data: formattedCandidates,
        message: 'Candidates retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve candidates'
      });
    }
  }

  async compareCandidates(req: Request, res: Response): Promise<void> {
    try {
      const { candidate1Id, candidate2Id } = req.params;
      const { userId } = req.body;
      const language = getLanguageFromRequest(req);
      
      const comparison = await campaignService.compareCandidates(
        parseInt(candidate1Id),
        parseInt(candidate2Id),
        userId
      );

      const formattedComparison = {
        candidate1: formatBilingualResponse(comparison.candidate1, language),
        candidate2: formatBilingualResponse(comparison.candidate2, language)
      };

      res.json({
        success: true,
        data: formattedComparison,
        message: 'Candidate comparison retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to compare candidates'
      });
    }
  }

  // Voting System Endpoints
  async getActiveVotingSessions(req: Request, res: Response): Promise<void> {
    try {
      const language = getLanguageFromRequest(req);
      
      const sessions = await campaignService.getActiveVotingSessions();

      const formattedSessions = sessions.map(session => 
        formatBilingualResponse(session, language)
      );

      res.json({
        success: true,
        data: formattedSessions,
        message: 'Active voting sessions retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve voting sessions'
      });
    }
  }

  async castVote(req: Request, res: Response): Promise<void> {
    try {
      const { userId, votingSessionId, candidateId } = req.body;
      const verificationData = {
        ip_address: req.ip,
        device_fingerprint: req.headers['user-agent'],
        method: 'otp' // This should be enhanced with proper verification
      };
      
      const vote = await campaignService.castVote(
        userId,
        votingSessionId,
        candidateId,
        verificationData
      );

      res.status(201).json({
        success: true,
        data: vote,
        message: 'Vote cast successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to cast vote'
      });
    }
  }

  async getVotingResults(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const language = getLanguageFromRequest(req);
      
      const results = await campaignService.getVotingResults(parseInt(sessionId));

      const formattedResults = {
        ...results,
        candidates: results.candidates.map((candidate: any) => 
          formatBilingualResponse(candidate, language)
        )
      };

      res.json({
        success: true,
        data: formattedResults,
        message: 'Voting results retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve voting results'
      });
    }
  }

  // Campaign Analytics Endpoints
  async getCampaignAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { constituencyId } = req.query;
      const language = getLanguageFromRequest(req);
      
      const analytics = await campaignService.getCampaignAnalytics(
        constituencyId ? parseInt(constituencyId as string) : undefined
      );

      const formattedAnalytics = formatBilingualResponse(analytics, language);

      res.json({
        success: true,
        data: formattedAnalytics,
        message: 'Campaign analytics retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve campaign analytics'
      });
    }
  }

  // "This Holiday for My Country" Campaign Dashboard
  async getCampaignDashboard(req: Request, res: Response): Promise<void> {
    try {
      const language = getLanguageFromRequest(req);
      
      // Get overall analytics
      const analytics = await campaignService.getCampaignAnalytics();
      
      // Get recent registrations
      const recentRegistrations = await campaignService.getVoterRegistrations();
      
      // Get recent surveys
      const recentSurveys = await campaignService.getVoterSurveys();

      const dashboard = {
        analytics: formatBilingualResponse(analytics, language),
        recentRegistrations: recentRegistrations.slice(0, 10).map(reg => 
          formatBilingualResponse(reg, language)
        ),
        recentSurveys: recentSurveys.slice(0, 10).map(survey => 
          formatBilingualResponse(survey, language)
        ),
        campaignMessage: {
          title: language === 'ne' ? 'यो छुट्टी मेरो देशका लागि' : 'This Holiday for My Country',
          description: language === 'ne' 
            ? 'नेपाल फर्केर मतदान गर्नुहोस्। आफ्नो मत दिनुहोस्। आफ्नो देश बनाउनुहोस्।'
            : 'Return to Nepal to vote. Make your voice heard. Build your country.'
        }
      };

      res.json({
        success: true,
        data: dashboard,
        message: 'Campaign dashboard retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve campaign dashboard'
      });
    }
  }
}
