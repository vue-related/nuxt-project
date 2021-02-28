nuxt搭配API server：
https://blog.lichter.io/posts/nuxt-with-an-api/

搭配serverMiddleware:
https://blog.lichter.io/posts/emails-through-nuxtjs/


@nuxt/proxy:
使用proxy模块把请求代理到独立的api server上：https://github.com/nuxt-community/proxy-module
nuxt内置的axios配置：https://github.com/nuxt-community/axios-module
@nuxtjs/proxy基于http-proxy-middleware(https://github.com/chimurai/http-proxy-middleware)模块。
target:目标主机
changeOrigin:修改发送http headers中的host为server的域，https://www.linchaoqun.com/html/cms/content.jsp?id=dcf1ec5b-92e5-4a5b-84f5-d9bbbc84f5a3
pathRewrite:改变path部分
ws:代理websockets

@nuxt/axios:开启proxy选项，会自动集成@nuxt/proxy而无需主动注册@nuxt/proxy模块到nuxt.config.js中。
验证：proxy为false，配置@nuxt/proxy模块是否生效？proxy为true，不配置@nuxt/proxy模块，proxy选项是否生效？




一个示例：
https://codesandbox.io/s/github/manniL/nuxt-servermiddleware-example/tree/master
整合官网examples。


firebase:
https://blog.csdn.net/mp624183768/article/details/80553866





--------------------------------------------------------------------------

ES5/6模块导入导出：
https://gitchat.csdn.net/activity/5f03c3c9042fe032c4cd120c
https://blog.csdn.net/qq_36838191/article/details/88015668
https://blog.csdn.net/weixin_46412709/article/details/108213584
https://www.cnblogs.com/itgezhu/p/11584454.html
https://www.cnblogs.com/fsg6/p/13178789.html

export default：
https://www.jb51.net/article/108418.htm
https://www.cnblogs.com/qq254980080/p/10321564.html
https://www.cnblogs.com/xiaotanke/p/7448383.html

axios跨域：
https://zhuanlan.zhihu.com/p/68258766
https://stackoverflow.com/questions/55445196/cors-blocking-client-request-in-nuxt-js

Window 或 Document 对象未定义：
https://zh.nuxtjs.org/faq/window-document-undefined/
https://www.cnblogs.com/buerwei/p/11678327.html

--------------------------------------------------------------------------
nuxt路由拦截：
https://zhuanlan.zhihu.com/p/35864591

nuxt/auth:
https://blog.csdn.net/qq_21567385/article/details/108459773

中间件：
https://www.cnblogs.com/zxuedong/p/12550155.html
https://zhuanlan.zhihu.com/p/35864591

nuxtjs:
https://www.ctolib.com/topics-143006.html
https://zh.nuxtjs.org/

PanJiaChen/的element admin：
vue-element-admin
vue-admin-template
vue-typescript-admin-template

nuxtjs与vue element admin的整合：
nuxtjs目录结构、vue-admin-template对比。
整合示例：
https://github.com/Orabtc/nuxt-admin-template
https://gitee.com/weishuwen/nuxt-admin
https://github.com/nguyenduclong-ict/nuxt-element-admin
https://github.com/nguyenduclong-ict/nuxt-element-admin
https://github.com/kudismetal/nuxt-element-admin
https://github.com/hjyyang/nuxt-admin

--------------------------------------------
DMZ：
https://www.jianshu.com/p/8580587c3201
https://jingyan.baidu.com/article/a24b33cda5356a59fe002bfa.html
然后是设置将自己的NAS主机的IP地址设置成DMZ主机，DMZ的意思是将路由器下面的某个IP地址的全部端口都暴露到公网上，这样就免去了设置许多端口映射的麻烦。比如不管黑群还是威联通的默认端口都是5000，只要设置上DMZ, 这种5000,6699,9091之类的端口都直接映射到WAN口IP上，只要输入DDNS的域名:端口号就能访问了。省去了设置一大堆端口映射的麻烦，但是像80端口，8080这类被运营商屏蔽的端口还是需要在转发中单独设置一下，比如WAN口的端口设置成8088内网设置成80，这样就可以访问到内网的服务了。
例如我的NAS的IP地址是192.168.1.100这里就设置成192.168.1.100，但是如果你手里有两台NAS，都在同一个路由器下，那就得考虑主次了，正常情况下能够被DMZ的主机只有一个，其他主机的映射就只能能靠设置端口转发来实现了。
--------------------------------------------
koa：
koa-static: 扫描指定目录内的文件，作为静态资源文件中间件，匹配请求中的url和本地映射目录，匹配上则直接返回，否则执行next()放行，留给后续中间件处理。

中间件和路由没有匹配到，则ctx.status被置为404。
--------------------------------------------
router激活的路由：.router-link-exact-active.router-link-active
ts prop默认值写法:
https://www.cnblogs.com/richard1015/p/13476009.html
ts prop: Property 'msg' has no initializer and is not definitely assigned in the constructor.
https://blog.csdn.net/qq_41261490/article/details/102605640
// same as: @Prop() private msg!: string #!用于给变量设置默认初始值，vue无法在class中使用constructor。
@Prop({ type: String, default: '' }) private msg!: string

《JavaScript高级程序设计》
《JavaScript语言精粹》
《Webpack实战：入门、进阶与调优》
--------------------------------------------
unit-jest
e2e-cypress
=============================================================
HTTPS协议时传输的数据是加密的（TSL和SSL），而用HTTP传输时是明文传输。

HTTPS协议对传输内容使用的是对称加密算法，也即通信双方使用相同的密钥。但是对于密钥分发过程则使用的是公钥加密。但是我如何确认服务器不是别人伪造的呢？——我需要验证他的身份，即验证他的公钥。在服务器给我提供的证书中，有他声明的公钥Kp1，也有第三方用第三方自己的私钥(Ks0)加密服务器公钥(Kp1)后的密文(Ck1)。假如我相信第三方的身份是真实可信的，那么我用第三方的公钥(Kp0)，解密服务器的被第三方加密的公钥，和服务器直接发给我的公钥比较。如果相同，则验证成功；不同则验证失败。

这里一个重要的假设是我相信第三方，也即我相信证书是有效的（证书还包含其它信息来供大家确定是否有效，上段描述只是简化）。然而这里我自己搭建的服务器所提供的证书并不被chrome所信任，所以验证失败。
======================================
nuxt功能：
https://zhuanlan.zhihu.com/p/68064258
https://blog.csdn.net/weixin_45115705/article/details/98784259

muxt官方示例：
https://zh.nuxtjs.org/examples/vuex-store

vuex的module模块用法：
https://www.jianshu.com/p/6b9578831d3e
https://codesandbox.io/s/92kjy998qo

vue+ts：
https://www.cnblogs.com/xiaohuizhang/p/11872044.html
https://www.jianshu.com/p/cf3c46456502

nuxt实战项目：
https://github.com/github1586/nuxt-bnhcp
https://github.com/EasyTuan/nuxt-elm
https://github.com/xuqiang521/nuxt-ssr-demo

--------------------------------------------------------------------------
meituan:
https://github.com/hualigushi/nuxt-meituan
https://github.com/xhwgood/Meituan-web
https://github.com/HaoXiangL/mt-web
https://github.com/lazyChan297/meituan-web
https://github.com/Reeyou/meituanWeb
https://github.com/EchoGodness/nuxt-mt-web

pure：
https://github.com/cao-lianhui/meituan
https://github.com/cenzhilin/meituan-web
https://github.com/1027820779/Meituan-static-web
https://github.com/wolongge/meituan-website-demo
https://github.com/YuDaChao/vue-nuxt-meituan
https://github.com/Absence-heart/meituan-pc



