const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Pages CRUD
const createPage = async (req, res) => {
  try {
    const { title, slug, content, language = 'en', status = 'DRAFT', metaTitle, metaDescription } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const page = await prisma.page.create({
      data: { title, slug, content, language, status, metaTitle, metaDescription }
    });

    res.status(201).json(page);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getPages = async (req, res) => {
  try {
    const { language = 'en', status } = req.query;
    const where = { language };
    if (status) where.status = status;

    const pages = await prisma.page.findMany({
      where,
      orderBy: { updatedAt: 'desc' }
    });

    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPageBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { language = 'en' } = req.query;

    const page = await prisma.page.findFirst({
      where: { slug, language }
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status, metaTitle, metaDescription } = req.body;

    const page = await prisma.page.update({
      where: { id },
      data: { title, content, status, metaTitle, metaDescription }
    });

    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.page.delete({ where: { id } });
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// News/Content CRUD
const createNews = async (req, res) => {
  try {
    const { title, content, excerpt, language = 'en', status = 'DRAFT', featuredImage, category, tags } = req.body;
    const authorId = req.user.userId;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const news = await prisma.content.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        authorId,
        type: 'NEWS',
        status,
        language,
        featuredImage,
        category,
        tags: tags || [],
        publishedAt: status === 'PUBLISHED' ? new Date() : null
      },
      include: {
        author: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNews = async (req, res) => {
  try {
    const { language = 'en', status, category, limit = 10, page = 1 } = req.query;
    const where = { type: 'NEWS', language };
    if (status) where.status = status;
    if (category) where.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [news, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: {
            select: { firstName: true, lastName: true, email: true }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.content.count({ where })
    ]);

    res.json({
      data: news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await prisma.content.findUnique({
      where: { id },
      include: {
        author: {
          select: { firstName: true, lastName: true, email: true }
        },
        translations: true
      }
    });

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, status, featuredImage, category, tags } = req.body;

    const updateData = { title, content, excerpt, status, featuredImage, category, tags };
    if (status === 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    const news = await prisma.content.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { firstName: true, lastName: true, email: true }
        }
      }
    });

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.content.delete({ where: { id } });
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPage,
  getPages,
  getPageBySlug,
  updatePage,
  deletePage,
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews
};