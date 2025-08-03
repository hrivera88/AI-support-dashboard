import { Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import serverlessExpress from '@vendia/serverless-express'
import { app } from './index'

// Create the serverless express handler
const serverlessExpressInstance = serverlessExpress({ app })

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Set context to not wait for empty event loop
  context.callbackWaitsForEmptyEventLoop = false

  // Add request logging for debugging
  if (process.env.LOG_LEVEL === 'debug') {
    console.log('Lambda Event:', JSON.stringify(event, null, 2))
  }

  try {
    const result = await serverlessExpressInstance(event, context)
    return result
  } catch (error) {
    console.error('Lambda handler error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      },
      body: JSON.stringify({
        error: {
          message: 'Internal server error',
          code: 'LAMBDA_ERROR'
        }
      })
    }
  }
}