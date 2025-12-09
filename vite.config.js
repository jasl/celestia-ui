import { defineConfig } from "vite"
import { resolve } from "node:path"
import fs from "node:fs"
import tailwindcss from "@tailwindcss/vite"

// Get all HTML files in the directory
const getHtmlFiles = (dir) => {
    let results = []
    const list = fs.readdirSync(dir)
    list.forEach((file) => {
        const filePath = resolve(dir, file)
        const stat = fs.statSync(filePath)
        if (stat && stat.isFile() && file.endsWith(".html")) {
            results.push(filePath)
        }
    })
    return results
}

const htmlFiles = getHtmlFiles(resolve(__dirname))
const input = Object.fromEntries(
    htmlFiles.map((file) => [
        file.split('/').pop().replace('.html', ''),
        file
    ])
)

export default defineConfig({
    base: "",
    server: {
        open: "/index.html",
        port: 3000,
    },
    plugins: [tailwindcss()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        rollupOptions: {
            input,
            output: {
                entryFileNames: `js/[name].js`,
                chunkFileNames: `js/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
})

