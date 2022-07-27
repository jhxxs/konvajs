# canvas 选区

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

> ⚠️ vue 升级到了 2.7，在不影响原有写法的基础上可以使用 vue3 的响应式；并引入了 typescript 支持（根据个人喜好选择是否使用 ts 开发），不影响原有 js；但需要修改的地方是原来的`/deep/`和`>>>`写法要更改成`v-deep(选择器)`或者简写`:deep(选择器)`，原来用到的地方我已同步修改，后续在用到`deep`时使用`:deep()`即可，这里的改动可以参考[这篇文章](https://blog.csdn.net/Yukinoshita_kino/article/details/117259198)。
