
import { htmlContent } from './html';
import { cssContent } from './css';

export function serveStatic(resource: string | undefined, res: any): boolean {
    if (!resource) {
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent, 200);
        return true;
    }

    if (resource === 'styles.css') {
        res.setHeader('Content-Type', 'text/css');
        res.send(cssContent, 200);
        return true;
    }

    return false;
}