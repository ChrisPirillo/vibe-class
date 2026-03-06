export type PortfolioStatus = 'submitted';

export function getPortfolioStatusMessage(status?: string) {
  switch (status as PortfolioStatus) {
    case 'submitted':
      return {
        tone: 'success',
        text: 'Your app was submitted and added to your portfolio.'
      };
    default:
      return null;
  }
}
