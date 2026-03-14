import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMatch = async (req, res) => {
  try {
    const { competitionId, homeTeamId, awayTeamId, venue, scheduledDate } = req.body;

    const match = await prisma.match.create({
      data: {
        competitionId,
        homeTeamId,
        awayTeamId,
        venue,
        scheduledDate: new Date(scheduledDate),
        status: 'SCHEDULED'
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true
      }
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMatches = async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (upcoming === 'true') {
      where.scheduledDate = { gte: new Date() };
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true
      },
      orderBy: { scheduledDate: 'asc' }
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true,
        referee: true
      }
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { homeScore, awayScore, status, refereeId } = req.body;

    const match = await prisma.match.update({
      where: { id },
      data: {
        homeScore,
        awayScore,
        status,
        refereeId
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        competition: true
      }
    });

    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.match.delete({
      where: { id }
    });

    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
