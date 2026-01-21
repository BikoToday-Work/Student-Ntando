const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Document Management
const uploadDocument = async (req, res) => {
  try {
    const { name, type, fileUrl, entityType, entityId } = req.body;
    const createdBy = req.user.userId;

    if (!name || !type || !fileUrl) {
      return res.status(400).json({ error: 'Name, type, and fileUrl are required' });
    }

    const document = await prisma.document.create({
      data: {
        name,
        type,
        fileUrl,
        entityType,
        entityId,
        createdBy,
        status: 'DRAFT'
      },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { type, status, entityType } = req.query;
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (entityType) where.entityType = entityType;

    const documents = await prisma.document.findMany({
      where,
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true }
        },
        approver: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true }
        },
        approver: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedBy = req.user.userId;

    const document = await prisma.document.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy
      },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true }
        },
        approver: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Secretariat Tasks
const createTask = async (req, res) => {
  try {
    const { title, description, assignedRole, dueDate, priority = 'MEDIUM' } = req.body;
    const submittedBy = req.user.userId;

    if (!title || !description || !assignedRole) {
      return res.status(400).json({ error: 'Title, description, and assignedRole are required' });
    }

    // Create workflow instance for task
    const workflow = await prisma.workflow.findFirst({
      where: { type: 'DOCUMENT_APPROVAL', isActive: true }
    });

    if (!workflow) {
      return res.status(400).json({ error: 'No active workflow found' });
    }

    const workflowInstance = await prisma.workflowInstance.create({
      data: {
        workflowId: workflow.id,
        entityType: 'TASK',
        entityId: title, // Using title as entityId for tasks
        submittedBy,
        status: 'PENDING'
      }
    });

    // Create document for the task
    const document = await prisma.document.create({
      data: {
        name: title,
        type: 'FORM',
        content: JSON.stringify({
          title,
          description,
          assignedRole,
          dueDate,
          priority,
          workflowInstanceId: workflowInstance.id
        }),
        createdBy: submittedBy,
        status: 'PENDING_APPROVAL'
      },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.status(201).json({
      task: document,
      workflowInstance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { assignedRole, status } = req.query;
    const userRole = req.user.role;

    const where = { type: 'FORM' };
    if (status) where.status = status;

    const documents = await prisma.document.findMany({
      where,
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true }
        },
        approver: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Filter tasks based on user role and assigned role
    const tasks = documents.filter(doc => {
      if (!doc.content) return false;
      try {
        const taskData = JSON.parse(doc.content);
        if (assignedRole && taskData.assignedRole !== assignedRole) return false;
        if (userRole !== 'ADMIN' && taskData.assignedRole !== userRole) return false;
        return true;
      } catch {
        return false;
      }
    }).map(doc => {
      const taskData = JSON.parse(doc.content);
      return {
        id: doc.id,
        title: taskData.title,
        description: taskData.description,
        assignedRole: taskData.assignedRole,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        creator: doc.creator,
        approver: doc.approver
      };
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const actionBy = req.user.userId;

    const document = await prisma.document.update({
      where: { id },
      data: { status },
      include: {
        creator: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: actionBy,
        action: `Task status updated to ${status}`,
        entityType: 'TASK',
        entityId: id,
        newValues: { status, comment }
      }
    });

    const taskData = JSON.parse(document.content);
    res.json({
      id: document.id,
      title: taskData.title,
      description: taskData.description,
      assignedRole: taskData.assignedRole,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      creator: document.creator
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  approveDocument,
  createTask,
  getTasks,
  updateTaskStatus
};