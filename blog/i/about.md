title: 关于该静态博客系统

---

## 简介

想必大家很想尽快了解这个简单的博客系统了。该博客系统的源代码在：

那么先来说说它的优缺点吧。

优点：

*   储存空间占用量极少。
*   访客浏览时无须时时刷新整个网页，能够获得更流畅的体验。
*   能够在浏览器中即时转换 Markdown 源代码为博文，无须自备的转换工具。
*   不需要特别的服务器，只要一个域名和一个能够正常展示网页的空间就够了。
*   相对于其它静态博客系统，该系统的更新上传所需的文件极少，且更新时只需要一个 FTP 上传下载工具（GitHub 等储存平台除外）。

缺点：

*   一般来说必须手动更新上传博客文件。
*   文章订阅功能须另外设置，而且有点麻烦。
*   如非自行修改博客模板，必须使用 Markdown 语言编写文章。
*   暂时无法获得多种优秀博客模板，修改主题亦须具备网页编写能力。
*   IE9 以及 IE9 以下的 IE 浏览器，以及较旧版的火狐浏览器，都无法正常浏览。
*   搜索引擎优化极差，目前只能通过在首页源代码中静态保留文章目录让搜索引擎收录。

综上所述，如果你越符合以下标签，就越能享受这个博客系统：

*   对博客样式没有太大要求，或拥有网页编写能力。
*   用惯静态博客且对 SEO 没有高要求，追求更小巧易用的博客系统。
*   喜欢使用 [Markdown][] 语言写文章，并知晓该写作方式的优点。
*   想自定义整个博客系统！

[Markdown]: http://daringfireball.net/projects/markdown/dingus

好了，现在开始讲述使用方法了。


## 安装博客系统

1.  获得域名和空间

    域名想必大家都不默生了，总之这个博客无法通过直接在浏览器中打开本地文件使用，必须通过合法域名访问才能正常浏览。免费域名有很多，其中顶级域名有 .ml .tk 等等，均可在网上注册。

    空间即是指能够存放网页文件的网络平台，并且该平台提供展示 HTML 网页文件的服务。例如免费的 [Baidu Application Engine][BAE], [OpenShift][], [GitHub Pages][] 。

    得到域名和空间后便将域名绑定到空间就 OK 了，假如免费空间不需要自定义域名的话也就可以不另外注册域名了。

2.  配置博客信息

    打开 `js/blog/config.js` ，然后按照指示修改相应内容并保存文件。不懂的请留言。

3.  上传博客文件到空间

    这一步交由空间提供方解释。

[BAE]: http://developer.baidu.com/bae/ "百度云平台"
[OpenShift]: https://www.openshift.com "被和谐得简直成了一坨 Shit ……"
[GitHub Pages]: http://pages.github.com "GitHub 提供的项目文档托管服务"

## 上传更新文章

1.  首先修改 `index.html` 文件，搜索「USER DATA」找到文章列表信息，然后按照相同的格式增删内容便可。

    `data-file` 为源文件路径，采用相对于博客所在路径的路径。

    `data-url` 为文章在网页中所使用的相对链接。

    至于标题，一下就知道怎么填了。

2.  创建你在 `data-file` 属性指定的 Markdown 代码源文件，该源文件的内容由两部分组成。

    第一部分为由 [YAML][] 语言编写的配置信息，指定 title（标题）、created（创建日期）、modified（修改日期）三个属性。

    第二部分为文章的 Markdown 源代码。

    两部分之间由单独一行「---」分隔。

3.  修改并创建了以上文件后，上传更新那些文件就 OK 了。

[YAML]: http://yaml.org

## 文章订阅配置

安装并浏览该博客之后，你可能会发现右侧的 Feed 订阅图片根本没有任何功能。那，你要么不去管它，把它换成别的更有意思的图片，或者，好好地折腾一下如何生成订阅链接，让访客关注你的更新动态。

你可以用 [FEED43][] 免费提供的 feed 定制服务来为你的博客生成订阅链接：

1.  到 http://feed43.com/feed.html?action=new 开始创建。

    勾选「I agree to the Terms of Service」以同意 ToS 的内容，然后点击「Continue」按钮继续。

    ![图：开始页面。](data/images/feed01.png)

2.  在「Address」一栏填写 `index.html` 文件对应的完整 URL ，即指定了文章列表信息的提取来源，然后在「Encoding」一栏指定内容编码为「utf-8」。按「Reload」按钮继续。

    ![图：文章提取来源地址。](data/images/feed02.png)

3.  接着看新出现的「Step 2」下的文本框，在「Global Search Pattern」处填上 `<ul id="-article-list">{%}</ul>` ，在「Item (repeatable) Search Pattern」处填 `<li {*}data-url="{%}"{*}>{%}</li>` 。按「Extract」按钮测试这两个用于提取文章列表信息的筛选命令是否有用。

    ![图：提取指令。](data/images/feed03.png)

    ![图：提取出的信息。](data/images/feed04.png)

4.  然后进行 feed 内容输出格式的指定。

    「Feed Title」改为你的网站名称，「Feed Link」改为你的网站首页 URL ，「Feed Description」填写网站简介信息。

    ![图：输出格式部分一。](data/images/feed05.png)

    「Item Title Template」处填 `{%2}` ，「Item Link Template」处填法类似 `http://example.com/#!/{%1}` ，「Item Content Template」处由于我们无法获取文章详细内容，故填写「打开页面以继续阅读……」之类的提示就好了。

    ![图：输出格式部分二。](data/images/feed06.png)

    点击「Preview」按钮进行效果预览，效果还不错吧？

    ![图：输出内容预览。](data/images/feed07.png)

5.  预览后生成的 Feed URL 就是我们所要提供给访客的订阅链接了！接着修改 `index.html` 中的「feed.xml」为该链接便 OK 了。

    ![图：生成的订阅链接。](data/images/feed08.png)

6.  假如对那一串数字不满意，还可以对其进行自定义，修改链接为你喜欢的样子。

    点击页面下方的「Change file name」以进行修改，不过限定了只能使用 `a-z` 和 `0-9` 之间的字符，改好后点击「Rename」就行。

    ![图：修改订阅链接的名称。](data/images/feed09.png)

7.  最后需要注意：FEED43 还提供了一条修改 feed 配置的链接，即是说假如你以后换域名了，还可以继续修改并使用那个 feed 订阅链接。

    另外还要注意：该 feed 配置页面的链接没有加密，任何人都可以进行操作，你还应该为其加上密码保护！

    继续点击页面下方的「Protect feed from being edited」，分别填上密码（Password）和用于找回密码的邮箱地址（E-mail），点击「Set」确定。从此进入 feed 配置页面就要输入密码了。

    ![图：为订阅链接的配置页面添加密码保护。](data/images/feed10.png)

OK ，订阅链接生成教程就此完毕。

[FEED43]: http://feed43.com

## 自行修改系统

如果只是想汉化一下界面，直接在文件中搜索相关词语就可以尝试修改了。

该博客系统的仅由以下核心文件组成：

*   `index.html`
*   `js/lib/minified.js`
*   `js/blog/*.js`
*   `js/app.js`

其余文件皆为辅助用途。在此，我推荐用 [Minified][] 这个 JS 库来编写主题，因为默认主题的代码就是基于它的，这个 JS 库十分小巧易用。另外不用担心是否一定要熟悉 Minified 的使用，因为只有 `js/blog/render.js` 这个文件是使用到它的。

至于更详细的说明，直接看源代码就 OK 了，我已经加了必要的注释（蹩脚的英文）。

[Minified]: http://minifiedjs.com

## 计划添加的功能

当然是指默认主题模板的功能或特性：

*   页面平滑过渡效果。
*   代码高亮功能以及 LATEX 公式展示功能。
*   在线 Markdown 文件编辑工具（不带图片插入功能）。
*   本地博客管理工具（非命令行）。
*   添加特殊页面：幻灯片。

无限期计划，主要看我个人的能力水平，因为我制作这个博客系统不单纯是为了分享，而且是练习所需。
