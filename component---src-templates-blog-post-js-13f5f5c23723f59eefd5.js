"use strict";(self.webpackChunkgatsby_starter_blog=self.webpackChunkgatsby_starter_blog||[]).push([[989],{4141:function(e,t,a){a.d(t,{Z:function(){return l}});var n=a(7294),r=a(5444),l=function(e){var t=e.location,a=e.children,l="/todayILearned/"===t.pathname;(0,r.useStaticQuery)("3708219967").allMarkdownRemark;return n.createElement("div",{className:"global-wrapper","data-is-root-path":l},n.createElement("header",{className:"global-header"},n.createElement(r.Link,{to:"/"},"Today I Learn")),n.createElement("div",{className:"contents-wrap"},n.createElement("main",null,a),n.createElement("footer",null,"© 2021, COPYRIGHT ALL RIGHT",n.createElement("a",{href:"https://www.gatsbyjs.com"}))))}},6179:function(e,t,a){var n=a(7294),r=a(5414),l=a(5444),i=function(e){var t,a,i,o=e.description,c=e.lang,s=e.meta,m=e.title,d=(0,l.useStaticQuery)("2841359383").site,p=o||d.siteMetadata.description,u=null===(t=d.siteMetadata)||void 0===t?void 0:t.title;return n.createElement(r.q,{htmlAttributes:{lang:c},title:m,titleTemplate:u?"%s | "+u:null,meta:[{name:"description",content:p},{property:"og:title",content:m},{property:"og:description",content:p},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:(null===(a=d.siteMetadata)||void 0===a||null===(i=a.social)||void 0===i?void 0:i.twitter)||""},{name:"twitter:title",content:m},{name:"twitter:description",content:p}].concat(s)})};i.defaultProps={lang:"en",meta:[],description:""},t.Z=i},4870:function(e,t,a){a.r(t);var n=a(7294),r=a(5444),l=a(4141),i=a(6179);t.default=function(e){var t,a=e.data,o=e.location,c=a.markdownRemark,s=(null===(t=a.site.siteMetadata)||void 0===t?void 0:t.title)||"Title",m=a.previous,d=a.next;return n.createElement(n.Fragment,null,n.createElement(l.Z,{location:o,title:s},n.createElement(i.Z,{title:c.frontmatter.title,description:c.frontmatter.description||c.excerpt}),n.createElement("article",{className:"blog-post",itemScope:!0,itemType:"http://schema.org/Article"},n.createElement("header",null,n.createElement("h1",{itemProp:"headline"},c.frontmatter.title),n.createElement("p",null,c.frontmatter.date)),n.createElement("section",{dangerouslySetInnerHTML:{__html:c.html},itemProp:"articleBody"}),n.createElement("hr",null)),n.createElement("nav",{className:"blog-post-nav"},n.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"space-between",listStyle:"none",padding:0}},n.createElement("li",null,m&&n.createElement(r.Link,{to:m.fields.slug,rel:"prev"},"← ",m.frontmatter.title)),n.createElement("li",null,d&&n.createElement(r.Link,{to:d.fields.slug,rel:"next"},d.frontmatter.title," →"))))))}}}]);
//# sourceMappingURL=component---src-templates-blog-post-js-13f5f5c23723f59eefd5.js.map