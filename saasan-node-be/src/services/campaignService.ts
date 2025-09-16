import db from "../config/database";
import {
  formatBilingualResponse,
  getLanguageFromRequest,
} from "../lib/bilingual";

export interface VoterRegistration {
  id?: number;
  userId: number;
  constituencyId: number;
  wardId: number;
  registrationNumber: string;
  registrationDate: Date;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationNotes?: string;
}

export interface VoterIntentSurvey {
  id?: number;
  userId: number;
  constituencyId: number;
  returnIntent: "returning" | "unsure" | "cannot";
  returnReason?: string;
  votingIntent?: "will_vote" | "might_vote" | "will_not_vote";
  preferredCandidateId?: number;
  concerns?: string[];
  suggestions?: string;
  surveyDate: Date;
}

export interface ElectionCandidate {
  id?: number;
  politicianId: number;
  electionType: "federal" | "provincial" | "local";
  electionYear: number;
  constituencyId: number;
  partyId: number;
  candidateNumber?: number;
  symbol?: string;
  symbolNepali?: string;
  manifesto?: string;
  manifestoNepali?: string;
  keyPromises?: string[];
  keyPromisesNepali?: string[];
  educationBackground?: string;
  educationBackgroundNepali?: string;
  professionalExperience?: string;
  professionalExperienceNepali?: string;
  criminalRecords?: any;
  assetDeclaration?: any;
  nominationDate?: Date;
  withdrawalDate?: Date;
  isActive: boolean;
  voteCount: number;
}

export interface VotingSession {
  id?: number;
  electionType: "federal" | "provincial";
  electionYear: number;
  constituencyId: number;
  sessionName: string;
  sessionNameNepali?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  totalEligibleVoters?: number;
  totalVotesCast: number;
  resultsPublished: boolean;
}

export interface CampaignAnalytics {
  totalRegistrations: number;
  totalSurveys: number;
  returnIntentBreakdown: {
    returning: number;
    unsure: number;
    cannot: number;
  };
  votingIntentBreakdown: {
    will_vote: number;
    might_vote: number;
    will_not_vote: number;
  };
  constituencyStats: Array<{
    constituencyId: number;
    constituencyName: string;
    constituencyNameNepali?: string;
    registrations: number;
    surveys: number;
    returnIntent: any;
    votingIntent: any;
  }>;
}

export class CampaignService {
  // Voter Registration
  async registerVoter(
    registration: VoterRegistration
  ): Promise<VoterRegistration> {
    const [result] = await db("voter_registrations")
      .insert(registration)
      .returning("*");
    return result;
  }

  async getVoterRegistrations(
    constituencyId?: number,
    userId?: number
  ): Promise<VoterRegistration[]> {
    let query = db("voter_registrations")
      .select("*")
      .orderBy("created_at", "desc");

    if (constituencyId) {
      query = query.where("constituency_id", constituencyId);
    }
    if (userId) {
      query = query.where("user_id", userId);
    }

    return await query;
  }

  async verifyVoterRegistration(
    id: number,
    status: "verified" | "rejected",
    notes?: string
  ): Promise<VoterRegistration> {
    const [result] = await db("voter_registrations")
      .where("id", id)
      .update({
        verification_status: status,
        verification_notes: notes,
        updated_at: new Date(),
      })
      .returning("*");
    return result;
  }

  // Voter Intent Survey
  async submitVoterSurvey(
    survey: VoterIntentSurvey
  ): Promise<VoterIntentSurvey> {
    const [result] = await db("voter_intent_surveys")
      .insert(survey)
      .returning("*");
    return result;
  }

  async getVoterSurveys(
    constituencyId?: number,
    userId?: number
  ): Promise<VoterIntentSurvey[]> {
    let query = db("voter_intent_surveys")
      .select("*")
      .orderBy("survey_date", "desc");

    if (constituencyId) {
      query = query.where("constituency_id", constituencyId);
    }
    if (userId) {
      query = query.where("user_id", userId);
    }

    return await query;
  }

  // Election Candidates
  async createCandidate(
    candidate: ElectionCandidate
  ): Promise<ElectionCandidate> {
    const [result] = await db("election_candidates")
      .insert(candidate)
      .returning("*");
    return result;
  }

  async getCandidatesByConstituency(
    constituencyId: number,
    electionType: "federal" | "provincial" = "federal"
  ): Promise<any[]> {
    const candidates = await db("election_candidates")
      .select(
        "ec.*",
        "p.full_name",
        "p.full_name_nepali",
        "p.photo_url",
        "pp.name as party_name",
        "pp.name_nepali as party_name_nepali",
        "pp.logo_url as party_logo",
        "c.name as constituency_name",
        "c.name_nepali as constituency_name_nepali"
      )
      .from("election_candidates as ec")
      .leftJoin("politicians as p", "ec.politician_id", "p.id")
      .leftJoin("political_parties as pp", "ec.party_id", "pp.id")
      .leftJoin("constituencies as c", "ec.constituency_id", "c.id")
      .where("ec.constituency_id", constituencyId)
      .where("ec.election_type", electionType)
      .where("ec.is_active", true)
      .orderBy("ec.candidate_number");

    return candidates.map((candidate: any) => ({
      id: candidate.id,
      politicianId: candidate.politician_id,
      fullName: candidate.full_name,
      fullNameNepali: candidate.full_name_nepali,
      photoUrl: candidate.photo_url,
      party: {
        id: candidate.party_id,
        name: candidate.party_name,
        nameNepali: candidate.party_name_nepali,
        logoUrl: candidate.party_logo,
      },
      constituency: {
        id: candidate.constituency_id,
        name: candidate.constituency_name,
        nameNepali: candidate.constituency_name_nepali,
      },
      candidateNumber: candidate.candidate_number,
      symbol: candidate.symbol,
      symbolNepali: candidate.symbol_nepali,
      manifesto: candidate.manifesto,
      manifestoNepali: candidate.manifesto_nepali,
      keyPromises: candidate.key_promises,
      keyPromisesNepali: candidate.key_promises_nepali,
      educationBackground: candidate.education_background,
      educationBackgroundNepali: candidate.education_background_nepali,
      professionalExperience: candidate.professional_experience,
      professionalExperienceNepali: candidate.professional_experience_nepali,
      criminalRecords: candidate.criminal_records,
      assetDeclaration: candidate.asset_declaration,
      voteCount: candidate.vote_count,
      isActive: candidate.is_active,
    }));
  }

  // Candidate Comparison
  async compareCandidates(
    candidate1Id: number,
    candidate2Id: number,
    userId: number
  ): Promise<any> {
    const candidates = await db("election_candidates")
      .select(
        "ec.*",
        "p.full_name",
        "p.full_name_nepali",
        "p.photo_url",
        "p.age",
        "p.education",
        "p.education_nepali",
        "pp.name as party_name",
        "pp.name_nepali as party_name_nepali",
        "pp.logo_url as party_logo"
      )
      .from("election_candidates as ec")
      .leftJoin("politicians as p", "ec.politician_id", "p.id")
      .leftJoin("political_parties as pp", "ec.party_id", "pp.id")
      .whereIn("ec.id", [candidate1Id, candidate2Id])
      .where("ec.is_active", true);

    if (candidates.length !== 2) {
      throw new Error("Both candidates must be found and active");
    }

    return {
      candidate1: this.formatCandidateData(candidates[0]),
      candidate2: this.formatCandidateData(candidates[1]),
    };
  }

  private formatCandidateData(candidate: any): any {
    return {
      id: candidate.id,
      politicianId: candidate.politician_id,
      fullName: candidate.full_name,
      fullNameNepali: candidate.full_name_nepali,
      photoUrl: candidate.photo_url,
      age: candidate.age,
      party: {
        name: candidate.party_name,
        nameNepali: candidate.party_name_nepali,
        logoUrl: candidate.party_logo,
      },
      education: candidate.education,
      educationNepali: candidate.education_nepali,
      candidateNumber: candidate.candidate_number,
      symbol: candidate.symbol,
      symbolNepali: candidate.symbol_nepali,
      manifesto: candidate.manifesto,
      manifestoNepali: candidate.manifesto_nepali,
      keyPromises: candidate.key_promises,
      keyPromisesNepali: candidate.key_promises_nepali,
      educationBackground: candidate.education_background,
      educationBackgroundNepali: candidate.education_background_nepali,
      professionalExperience: candidate.professional_experience,
      professionalExperienceNepali: candidate.professional_experience_nepali,
      criminalRecords: candidate.criminal_records,
      assetDeclaration: candidate.asset_declaration,
      voteCount: candidate.vote_count,
    };
  }

  // Voting System
  async createVotingSession(session: VotingSession): Promise<VotingSession> {
    const [result] = await db("voting_sessions").insert(session).returning("*");
    return result;
  }

  async getActiveVotingSessions(): Promise<VotingSession[]> {
    const now = new Date();
    return await db("voting_sessions")
      .select("*")
      .where("is_active", true)
      .where("start_date", "<=", now)
      .where("end_date", ">=", now)
      .orderBy("start_date");
  }

  async castVote(
    userId: number,
    votingSessionId: number,
    candidateId: number,
    verificationData: any
  ): Promise<any> {
    // Check if user already voted in this session
    const existingVote = await db("user_votes")
      .where("user_id", userId)
      .where("voting_session_id", votingSessionId)
      .first();

    if (existingVote) {
      throw new Error("User has already voted in this session");
    }

    // Check if voting session is active
    const session = await db("voting_sessions")
      .where("id", votingSessionId)
      .where("is_active", true)
      .first();

    if (!session) {
      throw new Error("Voting session is not active");
    }

    const now = new Date();
    if (now < session.start_date || now > session.end_date) {
      throw new Error("Voting session is not currently open");
    }

    // Cast the vote
    const [vote] = await db("user_votes")
      .insert({
        user_id: userId,
        voting_session_id: votingSessionId,
        candidate_id: candidateId,
        ip_address: verificationData.ip_address,
        device_fingerprint: verificationData.device_fingerprint,
        is_verified: true,
        verification_method: verificationData.method,
      })
      .returning("*");

    // Update vote count for candidate
    await db("election_candidates")
      .where("id", candidateId)
      .increment("vote_count", 1);

    // Update total votes cast for session
    await db("voting_sessions")
      .where("id", votingSessionId)
      .increment("total_votes_cast", 1);

    return vote;
  }

  async getVotingResults(votingSessionId: number): Promise<any> {
    const results = await db("election_candidates")
      .select(
        "ec.id",
        "ec.candidate_number",
        "ec.vote_count",
        "p.full_name",
        "p.full_name_nepali",
        "p.photo_url",
        "pp.name as party_name",
        "pp.name_nepali as party_name_nepali",
        "pp.logo_url as party_logo"
      )
      .from("election_candidates as ec")
      .leftJoin("politicians as p", "ec.politician_id", "p.id")
      .leftJoin("political_parties as pp", "ec.party_id", "pp.id")
      .whereIn("ec.id", function () {
        this.select("candidate_id")
          .from("user_votes")
          .where("voting_session_id", votingSessionId);
      })
      .orderBy("ec.vote_count", "desc");

    const totalVotes = results.reduce(
      (sum: number, candidate: any) => sum + candidate.vote_count,
      0
    );

    return {
      sessionId: votingSessionId,
      totalVotes,
      candidates: results.map((candidate: any) => ({
        id: candidate.id,
        candidateNumber: candidate.candidate_number,
        fullName: candidate.full_name,
        fullNameNepali: candidate.full_name_nepali,
        photoUrl: candidate.photo_url,
        party: {
          name: candidate.party_name,
          nameNepali: candidate.party_name_nepali,
          logoUrl: candidate.party_logo,
        },
        voteCount: candidate.vote_count,
        votePercentage:
          totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0,
      })),
    };
  }

  // Campaign Analytics
  async getCampaignAnalytics(
    constituencyId?: number
  ): Promise<CampaignAnalytics> {
    // Get registration counts
    let registrationQuery = db("voter_registrations").count("* as count");
    if (constituencyId) {
      registrationQuery = registrationQuery.where(
        "constituency_id",
        constituencyId
      );
    }
    const [{ count: totalRegistrations }] = await registrationQuery;

    // Get survey counts
    let surveyQuery = db("voter_intent_surveys").count("* as count");
    if (constituencyId) {
      surveyQuery = surveyQuery.where("constituency_id", constituencyId);
    }
    const [{ count: totalSurveys }] = await surveyQuery;

    // Get return intent breakdown
    let returnIntentQuery = db("voter_intent_surveys")
      .select("return_intent")
      .count("* as count")
      .groupBy("return_intent");
    if (constituencyId) {
      returnIntentQuery = returnIntentQuery.where(
        "constituency_id",
        constituencyId
      );
    }
    const returnIntentResults = await returnIntentQuery;

    const returnIntentBreakdown = {
      returning: 0,
      unsure: 0,
      cannot: 0,
    };
    returnIntentResults.forEach((row: any) => {
      returnIntentBreakdown[
        row.return_intent as keyof typeof returnIntentBreakdown
      ] = parseInt(row.count);
    });

    // Get voting intent breakdown
    let votingIntentQuery = db("voter_intent_surveys")
      .select("voting_intent")
      .count("* as count")
      .groupBy("voting_intent");
    if (constituencyId) {
      votingIntentQuery = votingIntentQuery.where(
        "constituency_id",
        constituencyId
      );
    }
    const votingIntentResults = await votingIntentQuery;

    const votingIntentBreakdown = {
      will_vote: 0,
      might_vote: 0,
      will_not_vote: 0,
    };
    votingIntentResults.forEach((row: any) => {
      if (row.voting_intent) {
        votingIntentBreakdown[
          row.voting_intent as keyof typeof votingIntentBreakdown
        ] = parseInt(row.count);
      }
    });

    // Get constituency stats
    const constituencyStats = await db("voter_intent_surveys")
      .select(
        "c.id as constituency_id",
        "c.name as constituency_name",
        "c.name_nepali as constituency_name_nepali"
      )
      .count("vis.id as surveys")
      .leftJoin("constituencies as c", "vis.constituency_id", "c.id")
      .leftJoin(
        "voter_registrations as vr",
        "vis.constituency_id",
        "vr.constituency_id"
      )
      .from("voter_intent_surveys as vis")
      .groupBy("c.id", "c.name", "c.name_nepali")
      .orderBy("surveys", "desc");

    return {
      totalRegistrations: parseInt(String(totalRegistrations)),
      totalSurveys: parseInt(String(totalSurveys)),
      returnIntentBreakdown,
      votingIntentBreakdown,
      constituencyStats: constituencyStats.map((stat: any) => ({
        constituencyId: stat.constituency_id,
        constituencyName: stat.constituency_name,
        constituencyNameNepali: stat.constituency_name_nepali,
        registrations: 0, // TODO: Calculate actual registrations per constituency
        surveys: parseInt(stat.surveys),
        returnIntent: returnIntentBreakdown,
        votingIntent: votingIntentBreakdown,
      })),
    };
  }
}
