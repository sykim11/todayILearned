"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[678],{1496:function(e,t,a){var r=a(5318);t.Z=void 0;var i,n=r(a(1506)),s=r(a(5354)),l=r(a(7316)),o=r(a(7154)),d=r(a(7294)),c=r(a(5697)),u=["sizes","srcSet","src","style","onLoad","onError","loading","draggable","ariaHidden"],f=function(e){var t=(0,o.default)({},e),a=t.resolutions,r=t.sizes,i=t.critical;return a&&(t.fixed=a,delete t.resolutions),r&&(t.fluid=r,delete t.sizes),i&&(t.loading="eager"),t.fluid&&(t.fluid=L([].concat(t.fluid))),t.fixed&&(t.fixed=L([].concat(t.fixed))),t},m=function(e){var t=e.media;return!!t&&(y&&!!window.matchMedia(t).matches)},p=function(e){var t=e.fluid,a=e.fixed,r=g(t||a||[]);return r&&r.src},g=function(e){if(y&&function(e){return!!e&&Array.isArray(e)&&e.some((function(e){return void 0!==e.media}))}(e)){var t=e.findIndex(m);if(-1!==t)return e[t];var a=e.findIndex((function(e){return void 0===e.media}));if(-1!==a)return e[a]}return e[0]},h=Object.create({}),b=function(e){var t=f(e),a=p(t);return h[a]||!1},v="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,y="undefined"!=typeof window,E=y&&window.IntersectionObserver,S=new WeakMap;function w(e){return e.map((function(e){var t=e.src,a=e.srcSet,r=e.srcSetWebp,i=e.media,n=e.sizes;return d.default.createElement(d.default.Fragment,{key:t},r&&d.default.createElement("source",{type:"image/webp",media:i,srcSet:r,sizes:n}),a&&d.default.createElement("source",{media:i,srcSet:a,sizes:n}))}))}function L(e){var t=[],a=[];return e.forEach((function(e){return(e.media?t:a).push(e)})),[].concat(t,a)}function I(e){return e.map((function(e){var t=e.src,a=e.media,r=e.tracedSVG;return d.default.createElement("source",{key:t,media:a,srcSet:r})}))}function R(e){return e.map((function(e){var t=e.src,a=e.media,r=e.base64;return d.default.createElement("source",{key:t,media:a,srcSet:r})}))}function N(e,t){var a=e.srcSet,r=e.srcSetWebp,i=e.media,n=e.sizes;return"<source "+(t?"type='image/webp' ":"")+(i?'media="'+i+'" ':"")+'srcset="'+(t?r:a)+'" '+(n?'sizes="'+n+'" ':"")+"/>"}var x=function(e,t){var a=(void 0===i&&"undefined"!=typeof window&&window.IntersectionObserver&&(i=new window.IntersectionObserver((function(e){e.forEach((function(e){if(S.has(e.target)){var t=S.get(e.target);(e.isIntersecting||e.intersectionRatio>0)&&(i.unobserve(e.target),S.delete(e.target),t())}}))}),{rootMargin:"200px"})),i);return a&&(a.observe(e),S.set(e,t)),function(){a.unobserve(e),S.delete(e)}},k=function(e){var t=e.src?'src="'+e.src+'" ':'src="" ',a=e.sizes?'sizes="'+e.sizes+'" ':"",r=e.srcSet?'srcset="'+e.srcSet+'" ':"",i=e.title?'title="'+e.title+'" ':"",n=e.alt?'alt="'+e.alt+'" ':'alt="" ',s=e.width?'width="'+e.width+'" ':"",l=e.height?'height="'+e.height+'" ':"",o=e.crossOrigin?'crossorigin="'+e.crossOrigin+'" ':"",d=e.loading?'loading="'+e.loading+'" ':"",c=e.draggable?'draggable="'+e.draggable+'" ':"";return"<picture>"+e.imageVariants.map((function(e){return(e.srcSetWebp?N(e,!0):"")+N(e)})).join("")+"<img "+d+s+l+a+r+t+n+i+o+c+'style="position:absolute;top:0;left:0;opacity:1;width:100%;height:100%;object-fit:cover;object-position:center"/></picture>'},O=d.default.forwardRef((function(e,t){var a=e.src,r=e.imageVariants,i=e.generateSources,n=e.spreadProps,s=e.ariaHidden,l=d.default.createElement(z,(0,o.default)({ref:t,src:a},n,{ariaHidden:s}));return r.length>1?d.default.createElement("picture",null,i(r),l):l})),z=d.default.forwardRef((function(e,t){var a=e.sizes,r=e.srcSet,i=e.src,n=e.style,s=e.onLoad,c=e.onError,f=e.loading,m=e.draggable,p=e.ariaHidden,g=(0,l.default)(e,u);return d.default.createElement("img",(0,o.default)({"aria-hidden":p,sizes:a,srcSet:r,src:i},g,{onLoad:s,onError:c,ref:t,loading:f,draggable:m,style:(0,o.default)({position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"},n)}))}));z.propTypes={style:c.default.object,onError:c.default.func,onLoad:c.default.func};var C=function(e){function t(t){var a;(a=e.call(this,t)||this).seenBefore=y&&b(t),a.isCritical="eager"===t.loading||t.critical,a.addNoScript=!(a.isCritical&&!t.fadeIn),a.useIOSupport=!v&&E&&!a.isCritical&&!a.seenBefore;var r=a.isCritical||y&&(v||!a.useIOSupport);return a.state={isVisible:r,imgLoaded:!1,imgCached:!1,fadeIn:!a.seenBefore&&t.fadeIn,isHydrated:!1},a.imageRef=d.default.createRef(),a.placeholderRef=t.placeholderRef||d.default.createRef(),a.handleImageLoaded=a.handleImageLoaded.bind((0,n.default)(a)),a.handleRef=a.handleRef.bind((0,n.default)(a)),a}(0,s.default)(t,e);var a=t.prototype;return a.componentDidMount=function(){if(this.setState({isHydrated:y}),this.state.isVisible&&"function"==typeof this.props.onStartLoad&&this.props.onStartLoad({wasCached:b(this.props)}),this.isCritical){var e=this.imageRef.current;e&&e.complete&&this.handleImageLoaded()}},a.componentWillUnmount=function(){this.cleanUpListeners&&this.cleanUpListeners()},a.handleRef=function(e){var t=this;this.useIOSupport&&e&&(this.cleanUpListeners=x(e,(function(){var e=b(t.props);t.state.isVisible||"function"!=typeof t.props.onStartLoad||t.props.onStartLoad({wasCached:e}),t.setState({isVisible:!0},(function(){t.setState({imgLoaded:e,imgCached:!(!t.imageRef.current||!t.imageRef.current.currentSrc)})}))})))},a.handleImageLoaded=function(){var e,t,a;e=this.props,t=f(e),(a=p(t))&&(h[a]=!0),this.setState({imgLoaded:!0}),this.props.onLoad&&this.props.onLoad()},a.render=function(){var e=f(this.props),t=e.title,a=e.alt,r=e.className,i=e.style,n=void 0===i?{}:i,s=e.imgStyle,l=void 0===s?{}:s,c=e.placeholderStyle,u=void 0===c?{}:c,m=e.placeholderClassName,p=e.fluid,h=e.fixed,b=e.backgroundColor,v=e.durationFadeIn,y=e.Tag,E=e.itemProp,S=e.loading,L=e.draggable,N=p||h;if(!N)return null;var x=!1===this.state.fadeIn||this.state.imgLoaded,C=!0===this.state.fadeIn&&!this.state.imgCached,V=(0,o.default)({opacity:x?1:0,transition:C?"opacity "+v+"ms":"none"},l),H="boolean"==typeof b?"lightgray":b,T={transitionDelay:v+"ms"},P=(0,o.default)({opacity:this.state.imgLoaded?0:1},C&&T,l,u),_={title:t,alt:this.state.isVisible?"":a,style:P,className:m,itemProp:E},M=this.state.isHydrated?g(N):N[0];if(p)return d.default.createElement(y,{className:(r||"")+" gatsby-image-wrapper",style:(0,o.default)({position:"relative",overflow:"hidden",maxWidth:M.maxWidth?M.maxWidth+"px":null,maxHeight:M.maxHeight?M.maxHeight+"px":null},n),ref:this.handleRef,key:"fluid-"+JSON.stringify(M.srcSet)},d.default.createElement(y,{"aria-hidden":!0,style:{width:"100%",paddingBottom:100/M.aspectRatio+"%"}}),H&&d.default.createElement(y,{"aria-hidden":!0,title:t,style:(0,o.default)({backgroundColor:H,position:"absolute",top:0,bottom:0,opacity:this.state.imgLoaded?0:1,right:0,left:0},C&&T)}),M.base64&&d.default.createElement(O,{ariaHidden:!0,ref:this.placeholderRef,src:M.base64,spreadProps:_,imageVariants:N,generateSources:R}),M.tracedSVG&&d.default.createElement(O,{ariaHidden:!0,ref:this.placeholderRef,src:M.tracedSVG,spreadProps:_,imageVariants:N,generateSources:I}),this.state.isVisible&&d.default.createElement("picture",null,w(N),d.default.createElement(z,{alt:a,title:t,sizes:M.sizes,src:M.src,crossOrigin:this.props.crossOrigin,srcSet:M.srcSet,style:V,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:E,loading:S,draggable:L})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:k((0,o.default)({alt:a,title:t,loading:S},M,{imageVariants:N}))}}));if(h){var W=(0,o.default)({position:"relative",overflow:"hidden",display:"inline-block",width:M.width,height:M.height},n);return"inherit"===n.display&&delete W.display,d.default.createElement(y,{className:(r||"")+" gatsby-image-wrapper",style:W,ref:this.handleRef,key:"fixed-"+JSON.stringify(M.srcSet)},H&&d.default.createElement(y,{"aria-hidden":!0,title:t,style:(0,o.default)({backgroundColor:H,width:M.width,opacity:this.state.imgLoaded?0:1,height:M.height},C&&T)}),M.base64&&d.default.createElement(O,{ariaHidden:!0,ref:this.placeholderRef,src:M.base64,spreadProps:_,imageVariants:N,generateSources:R}),M.tracedSVG&&d.default.createElement(O,{ariaHidden:!0,ref:this.placeholderRef,src:M.tracedSVG,spreadProps:_,imageVariants:N,generateSources:I}),this.state.isVisible&&d.default.createElement("picture",null,w(N),d.default.createElement(z,{alt:a,title:t,width:M.width,height:M.height,sizes:M.sizes,src:M.src,crossOrigin:this.props.crossOrigin,srcSet:M.srcSet,style:V,ref:this.imageRef,onLoad:this.handleImageLoaded,onError:this.props.onError,itemProp:E,loading:S,draggable:L})),this.addNoScript&&d.default.createElement("noscript",{dangerouslySetInnerHTML:{__html:k((0,o.default)({alt:a,title:t,loading:S},M,{imageVariants:N}))}}))}return null},t}(d.default.Component);C.defaultProps={fadeIn:!0,durationFadeIn:500,alt:"",Tag:"div",loading:"lazy"};var V=c.default.shape({width:c.default.number.isRequired,height:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string}),H=c.default.shape({aspectRatio:c.default.number.isRequired,src:c.default.string.isRequired,srcSet:c.default.string.isRequired,sizes:c.default.string.isRequired,base64:c.default.string,tracedSVG:c.default.string,srcWebp:c.default.string,srcSetWebp:c.default.string,media:c.default.string,maxWidth:c.default.number,maxHeight:c.default.number});function T(e){return function(t,a,r){var i;if(!t.fixed&&!t.fluid)throw new Error("The prop `fluid` or `fixed` is marked as required in `"+r+"`, but their values are both `undefined`.");c.default.checkPropTypes(((i={})[a]=e,i),t,"prop",r)}}C.propTypes={resolutions:V,sizes:H,fixed:T(c.default.oneOfType([V,c.default.arrayOf(V)])),fluid:T(c.default.oneOfType([H,c.default.arrayOf(H)])),fadeIn:c.default.bool,durationFadeIn:c.default.number,title:c.default.string,alt:c.default.string,className:c.default.oneOfType([c.default.string,c.default.object]),critical:c.default.bool,crossOrigin:c.default.oneOfType([c.default.string,c.default.bool]),style:c.default.object,imgStyle:c.default.object,placeholderStyle:c.default.object,placeholderClassName:c.default.string,backgroundColor:c.default.oneOfType([c.default.string,c.default.bool]),onLoad:c.default.func,onError:c.default.func,onStartLoad:c.default.func,Tag:c.default.string,itemProp:c.default.string,loading:c.default.oneOf(["auto","lazy","eager"]),draggable:c.default.bool};var P=C;t.Z=P},4141:function(e,t,a){a.d(t,{Z:function(){return n}});var r=a(7294),i=a(5444),n=function(e){var t=e.location,a=e.children,n="/todayILearned/"===t.pathname;(0,i.useStaticQuery)("3708219967").allMarkdownRemark;return r.createElement("div",{className:"global-wrapper","data-is-root-path":n},r.createElement("header",{className:"global-header"},r.createElement(i.Link,{to:"/"},"Today I Learn")),r.createElement("div",{className:"contents-wrap"},r.createElement("main",null,a),r.createElement("footer",null,"© 2021, COPYRIGHT ALL RIGHT",r.createElement("a",{href:"https://www.gatsbyjs.com"}))))}},6179:function(e,t,a){var r=a(7294),i=a(5414),n=a(5444),s=function(e){var t,a,s,l=e.description,o=e.lang,d=e.meta,c=e.title,u=(0,n.useStaticQuery)("2841359383").site,f=l||u.siteMetadata.description,m=null===(t=u.siteMetadata)||void 0===t?void 0:t.title;return r.createElement(i.q,{htmlAttributes:{lang:o},title:c,titleTemplate:m?"%s | "+m:null,meta:[{name:"description",content:f},{property:"og:title",content:c},{property:"og:description",content:f},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:(null===(a=u.siteMetadata)||void 0===a||null===(s=a.social)||void 0===s?void 0:s.twitter)||""},{name:"twitter:title",content:c},{name:"twitter:description",content:f}].concat(d)})};s.defaultProps={lang:"en",meta:[],description:""},t.Z=s},8502:function(e,t,a){a.r(t),a.d(t,{default:function(){return m}});var r=a(7294),i=a(5444),n=a(6125),s=function(){var e,t,s=(0,i.useStaticQuery)("3257411868");null===(e=s.site.siteMetadata)||void 0===e||e.author,null===(t=s.site.siteMetadata)||void 0===t||t.social;return r.createElement("div",{className:"bio"},r.createElement(n.S,{className:"bio-avatar",layout:"fixed",formats:["auto","webp","avif"],src:"../images/main-pic.png",width:80,height:80,quality:90,alt:"Profile picture",__imageData:a(4530)}),r.createElement("p",null,"수영아 오늘도 공부했니"))},l=a(4141),o=a(6179),d="home-module--post_tag--BeAPM",c="home-module--post_tag_txt--+gQVd",u="home-module--post_tag_count--6Z225",f=a(1496),m=function(e){var t,a=e.data,n=e.location,m=a.posts.nodes.filter((function(e){return!0===e.frontmatter.publish}));console.log("posts",m);var p=a.categories;return 0===m.length?r.createElement(l.Z,{location:n},r.createElement(o.Z,{title:"All posts"}),r.createElement(s,null),r.createElement("p",null,"블로그 글들을 확인할 수 없습니다.")):r.createElement(l.Z,{location:n},r.createElement(o.Z,{title:"All posts"}),r.createElement(s,null),r.createElement("div",{className:"home-module--tagsWrap--WClgw"},r.createElement("div",{className:d},r.createElement(i.Link,{to:"/"},r.createElement("span",{className:c},"전체"),r.createElement("span",{className:u},p.totalCount))),null===(t=p.all)||void 0===t?void 0:t.map((function(e){return r.createElement("div",{className:d},r.createElement(i.Link,{to:"/"+e.name},r.createElement("span",{className:c},"# ",e.name),r.createElement("span",{className:u},e.totalCount)))}))),r.createElement("div",{className:"home-module--postsWrap--Lx84a"},null==m?void 0:m.map((function(e,t){var a,n,s;return r.createElement("div",{key:t,className:"home-module--post--6NpMA"},r.createElement("div",{className:"home-module--thumbnail--Se23y"},r.createElement(f.Z,{fluid:null===(a=e.frontmatter.image)||void 0===a||null===(n=a.childImageSharp)||void 0===n?void 0:n.fluid})),r.createElement("div",{className:"home-module--post_content--FgurA"},r.createElement("span",{className:d},r.createElement("span",{className:c},"# ",""+((null===(s=e.frontmatter.tags)||void 0===s?void 0:s[0])||""))),r.createElement("p",{className:"home-module--post_content_title--ejisz"},r.createElement(i.Link,{to:""+e.fields.slug,itemProp:"url"},e.frontmatter.title)),r.createElement("small",null,e.frontmatter.date)))}))))}},4530:function(e){e.exports=JSON.parse('{"layout":"fixed","backgroundColor":"#080808","images":{"fallback":{"src":"/todayILearned/static/d60907fb71ab9541e5e735363cadaee0/7f7a5/main-pic.png","srcSet":"/todayILearned/static/d60907fb71ab9541e5e735363cadaee0/7f7a5/main-pic.png 80w","sizes":"80px"},"sources":[{"srcSet":"/todayILearned/static/d60907fb71ab9541e5e735363cadaee0/bfe97/main-pic.avif 80w","type":"image/avif","sizes":"80px"},{"srcSet":"/todayILearned/static/d60907fb71ab9541e5e735363cadaee0/99ff4/main-pic.webp 80w","type":"image/webp","sizes":"80px"}]},"width":80,"height":80}')}}]);
//# sourceMappingURL=component---src-pages-index-js-41ec1aae88834ee2ef37.js.map