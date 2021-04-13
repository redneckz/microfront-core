/**
 * Inserts styles safely into MF mounting root.
 * If no MF context found, inserts styles into head.
 *
 * @param name - module name
 *
 * @returns ready to go "insert" option for style-loader or MiniCssExtractPlugin
 */
export function insertStyleSafely(name: string): (linkTag: Node) => void {
    return linkTag => {
        // All MFs should be loaded as a "var"
        if ((globalThis as any)[name] && (globalThis as any)[name].insertStyle) {
            // MF container context
            (globalThis as any)[name].insertStyle(linkTag);
        } else {
            // Default behavior (app context)
            document.head.appendChild(linkTag);
        }
    };
}
