/*
 * @LastEditTime: 2022-07-25 10:49:27
 * @Date: 2022-06-17 14:54:14
 * @Author: Lena
 * @LastEditors: Lena
 */
const webpack = require("webpack")
const { defineConfig } = require("@vue/cli-service")
const path = require("path")

const timeStamp = Date.now()

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    windicss: {}
  },
  publicPath: "./",
  // 由于项目里用的element-ui的内置组件，这里需要添加对应路径去转
  chainWebpack: (config) => {},
  configureWebpack: {
    plugins: [
      require("unplugin-auto-import/webpack")({
        dts: true,
        imports: ["vue"]
      })
    ],
    output: {
      filename: `js/[name].${timeStamp}.js`
    }
  }
})
