import { ModuleZoneData } from './microfront-isolation-api.model';

interface InsertStyleOptions {
    fallback?: (style: Node) => any;
    zone?: Zone | null;
}

/**
 * This function should be self-sufficient (other functions can not be used here),
 * cause it supposed to be used inside Webpack config
 */
export function insertStyle(
    style: Node,
    {
        fallback = style => {
            document.head.appendChild(style);
        },
        zone = Zone.current.getZoneWith('microfront')
    }: InsertStyleOptions = {}
) {
    try {
        // Inlined cause of webpack config nature
        const data: ModuleZoneData = zone?.get('data');
        const { params: { root } = {} } = data;
        root!.prepend(style);
        if (!data.styles) data.styles = [];
        data.styles.push(style);
    } catch (err) {
        console.warn(err);
        fallback(style);
    }
}
