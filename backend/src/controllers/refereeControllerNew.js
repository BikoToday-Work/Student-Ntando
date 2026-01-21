const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Referee Management
const createReferee = async (req, res) => {
  try {
    const { userId, licenseNumber, certification, experience, availability } = req.body;
    
    if (!userId || !licenseNumber || !certification) {
      return res.status(400).json({ error: 'UserId, licenseNumber, and certification are required' });
    }

    // Check if user exists and has REFEREE role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'REFEREE') {
      return res.status(400).json({ error: 'User must have REFEREE role' });
    }

    const referee = await prisma.referee.create({
      data: {
        userId,
        licenseNumber,
        certification,
        experience: parseInt(experience) || 0,
        availability: availability || {}
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.status(201).json(referee);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'License number already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getReferees = async (req, res) => {
  try {
    const { search, certification, experience } = req.query;
    const where = {};
    
    if (certification) where.certification = { contains: certification, mode: 'insensitive' };
    if (experience) where.experience = { gte: parseInt(experience) };

    const referees = await prisma.referee.findMany({
      where,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        assignments: {
          include: {
            match: {
              select: { scheduledAt: true, homeTeam: { select: { name: true } }, awayTeam: { select: { name: true } } }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter by name if search provided
    let filteredReferees = referees;
    if (search) {
      filteredReferees = referees.filter(ref => 
        `${ref.user.firstName} ${ref.user.lastName}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filteredReferees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRefereeById = async (req, res) => {
  try {
    const { id } = req.params;

    const referee = await prisma.referee.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        },
        assignments: {
          include: {
            match: {
              select: { 
                scheduledAt: true, 
                homeTeam: { select: { name: true } }, 
                awayTeam: { select: { name: true } },
                competition: { select: { name: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reports: {
          include: {
            match: {
              select: { 
                scheduledAt: true,
                homeTeam: { select: { name: true } },
                awayTeam: { select: { name: true } }
              }
            },
            player: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!referee) {
      return res.status(404).json({ error: 'Referee not found' });
    }

    res.json(referee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReferee = async (req, res) => {
  try {
    const { id } = req.params;
    const { licenseNumber, certification, experience, availability } = req.body;

    const referee = await prisma.referee.update({
      where: { id },
      data: {
        licenseNumber,
        certification,
        experience: experience ? parseInt(experience) : undefined,
        availability
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json(referee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReferee = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.referee.delete({ where: { id } });
    res.json({ message: 'Referee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Disciplinary Reports
const createDisciplinaryReport = async (req, res) => {
  try {
    const { matchId, playerId, incident, action, minute, description } = req.body;
    const refereeId = req.user.refereeId || req.body.refereeId;

    if (!matchId || !refereeId || !incident || !action || !description) {
      return res.status(400).json({ error: 'MatchId, refereeId, incident, action, and description are required' });
    }

    const report = await prisma.disciplinaryReport.create({
      data: {
        matchId,
        refereeId,
        playerId,
        incident,
        action,
        minute: minute ? parseInt(minute) : null,
        description,
        status: 'SUBMITTED'
      },
      include: {
        referee: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        },
        match: {
          include: {
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } },
            competition: { select: { name: true } }
          }
        },
        player: {
          select: { firstName: true, lastName: true, team: { select: { name: true } } }
        }
      }
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDisciplinaryReports = async (req, res) => {
  try {
    const { refereeId, matchId, status, playerId } = req.query;
    const userRole = req.user.role;
    
    const where = {};
    if (refereeId) where.refereeId = refereeId;
    if (matchId) where.matchId = matchId;
    if (status) where.status = status;
    if (playerId) where.playerId = playerId;

    // Role-based filtering
    if (userRole === 'REFEREE' && req.user.refereeId) {
      where.refereeId = req.user.refereeId;
    }

    const reports = await prisma.disciplinaryReport.findMany({
      where,
      include: {
        referee: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        },
        match: {
          include: {
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } },
            competition: { select: { name: true } }
          }
        },
        player: {
          select: { firstName: true, lastName: true, team: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDisciplinaryReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await prisma.disciplinaryReport.update({
      where: { id },
      data: { status },
      include: {
        referee: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          }
        },
        match: {
          include: {
            homeTeam: { select: { name: true } },
            awayTeam: { select: { name: true } }
          }
        },
        player: {
          select: { firstName: true, lastName: true, team: { select: { name: true } } }
        }
      }
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReferee,
  getReferees,
  getRefereeById,
  updateReferee,
  deleteReferee,
  createDisciplinaryReport,
  getDisciplinaryReports,
  updateDisciplinaryReportStatus
};