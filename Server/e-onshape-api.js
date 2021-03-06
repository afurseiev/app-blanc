
const { onshapeApiUrl } = require('./b-config-from-env');
const { forwardRequestToOnshape } = require('./f-api-utils');

const apiRouter = require('express').Router();
/**
 * Get the Elements of the current document/workspace.
 * GET /api/elements
 *      -> 200, [ ...elements ]
 *      -or-
 *      -> 500, { error: '...' }
 */
apiRouter.get('/elements', (req, res) => {
    forwardRequestToOnshape(`${onshapeApiUrl}/documents/d/${req.query.documentId}/w/${req.query.workspaceId}/elements?withThumbnails=false`, req, res);
});

module.exports = apiRouter;