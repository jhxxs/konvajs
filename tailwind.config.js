/*
 * @LastEditTime: 2022-07-18 10:34:38
 * @Date: 2021-06-01 14:03:37
 * @Author: Lena
 * @LastEditors: Lena
 */
import { defineConfig } from "windicss/helpers"
import colors from "./src/utils/colors"

export default defineConfig({
  extract: {
    include: ["src/**/*.{vue,html,jsx,tsx}"],
    exclude: ["node_modules", ".git"]
  },
  theme: {
    extend: {
      backgroundColor: {
        deepGrayBg: "#383838",
        grayBg: "#434343",
        deepBlueBg: "rgba(24, 38, 51, 0.8)",
        blueBg: "#3A497C",
        baseBlack: "#222"
      },
      borderColor: {
        baseBorder: "#646464"
      },
      textColor: {
        placeholder: "#c0c4cc",
        textFirst: "#FAFAFA",
        textSecond: "#A7A7A7"
      },
      colors
    }
  },
  plugins: [require("windicss/plugin/line-clamp")]
})
