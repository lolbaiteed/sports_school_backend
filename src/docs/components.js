/**
 * @swagger
 *  components:
 *   requestBodies:
 *     CoachUpdate:
 *       description: Coach object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - reqRole
 *             properties:
 *               username:
 *                 type: string
 *                 example: test
 *               password:
 *                 type: string
 *                 example: test123
 *               phoneNumber:
 *                 type: string
 *                 example: +71234567890
 *               reqRole:
 *                 type: string
 *                 example: Coach
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               imgId:
 *                 type: integer
 *                 example: 3
 *               image:
 *                 description: Data of image, can be obtained from /
 *                 type: object
 *                 properties:
 *                   mimeType:
 *                     type: string
 *                     description: type of image
 *                     example: image/png
 *                   size:
 *                     type: integer
 *                     description: size of image
 *                     example: 512
 *                   filename:
 *                     type: string
 *                     description: name of file
 *                     example: test
 *                   url:
 *                     type: string
 *                     description: path to file
 *                     example: uploads/test.png
 *
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: An error occurred
 *
 *   responses:
 *     BadRequest:
 *       description: Invalid request payload
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Unauthorized:
 *       description: User is not authenticated
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: User authenticated but lacks permission
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
