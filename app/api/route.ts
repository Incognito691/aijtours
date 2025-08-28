// API Routes Index
// This file helps with API discoverability

export const apiRoutes = [
  {
    endpoint: '/api/packages',
    method: 'GET',
    description: 'Get all travel packages',
    public: true
  },
  {
    endpoint: '/api/events', 
    method: 'GET',
    description: 'Get all events and activities',
    public: true
  },
  {
    endpoint: '/api/contact',
    method: 'POST', 
    description: 'Send contact form',
    public: true
  },
  {
    endpoint: '/api/package-categories',
    method: 'GET',
    description: 'Get package categories',
    public: true
  }
];

export default function handler(req: any, res: any) {
  res.status(200).json({
    message: 'AFI Travel & Tourism API',
    version: '1.0.0',
    routes: apiRoutes.filter(route => route.public)
  });
}
