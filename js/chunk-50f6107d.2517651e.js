(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-50f6107d"],{"1b98":function(t,e,a){},"54f8":function(t,e,a){"use strict";a.r(e);var r,i=a("5530"),c=a("1da1"),n=(a("96cf"),a("c8e4")),s=a("999e"),o=(a("a4d3"),a("e01a"),a("2708")),l=a("141a"),u=a("2fa3"),d=a("6783"),p={name:"ReplyDetailContent",mixins:[o.a,o.b],components:{TweetReplyModal:l.a},props:{dataForContent:{type:Object,required:!0}},data:function(){return{dataForModal:{},localData:{user:{id:null}}}},methods:{setDataForModal:function(){var t=this.dataForContent,e=t.id,a=t.user,r=t.updatedAt,n=t.description,t=t.createdAt;this.dataForModal={id:e,updatedAt:r,description:n,createdAt:t,user:a}},toggleLike:function(){var n=this;return Object(c.a)(regeneratorRuntime.mark(function t(){var e,a,r;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,e=n.dataForContent.id,(a=n.dataForContent).isLiked)return t.next=6,d.a.unlikeTweet(e);t.next=14;break;case 6:if(r=t.sent,"success"!==(r=r.data).status)throw new Error(r.message);t.next=10;break;case 10:a.isLiked=!1,--a.likesLength,t.next=22;break;case 14:return t.next=16,d.a.likeTweet(e);case 16:if(r=t.sent,"success"!==(r=r.data).status)throw new Error(r.message);t.next=20;break;case 20:a.isLiked=!0,a.likesLength+=1;case 22:u.a.fire({icon:"success",title:"動作執行成功！"}),n.$emit("afterToggleLike",a.isLiked),t.next=29;break;case 26:t.prev=26,t.t0=t.catch(0),u.a.fire({icon:"error",title:"無法執行動作，請稍後再試！"});case 29:case"end":return t.stop()}},t,null,[[0,26]])}))()}},watch:{dataForContent:{handler:function(t){this.localData=t,this.setDataForModal()},deep:!0}}},f=(a("6810"),a("2877")),l=Object(f.a)(p,function(){var e=this,t=e.$createElement,t=e._self._c||t;return t("div",{staticClass:"container"},[t("div",{staticClass:"userInfo"},[t("div",{staticClass:"avatar"},[t("router-link",{attrs:{to:"/userprofile/"+e.localData.user.id}},[e.localData.user?t("img",{attrs:{src:e.localData.user.avatar,alt:""}}):t("img",{attrs:{src:"'' | emptyImageFilter",alt:""}})])],1),t("div",{staticClass:"userTitle"},[t("router-link",{attrs:{to:"/userprofile/"+e.localData.user.id}},[t("p",{staticClass:"text-dark"},[e._v(" "+e._s(e.localData.user?e.localData.user.name:"資料讀取中")+" ")])]),t("p",[e._v("@"+e._s(e.localData.user?e.localData.user.account:"資料讀取中"))])],1)]),t("div",{staticClass:"textContent"},[t("p",[e._v(e._s(e.localData.description))])]),t("div",{staticClass:"updatedAt"},[t("p",{staticClass:"tweetUpdateAt"},[e._v(e._s(e._f("exactDate")(e.localData.updatedAt)))])]),t("div",{staticClass:"feedbackCount"},[t("p",[e._v(e._s(e.localData.commentsLength)+" "),t("span",[e._v("回復 ")])]),t("p",[e._v(e._s(e.localData.likesLength)+" "),t("span",[e._v("喜歡次數")])])]),t("div",{staticClass:"tweetPanel"},[t("div",{staticClass:"comments"},[t("img",{attrs:{"data-toggle":"modal","data-target":"#tweetReplyModal-"+e.localData.id,src:a("6569"),alt:""}})]),t("TweetReplyModal",e._g({attrs:{tweet:e.dataForModal}},e.$listeners)),t("div",{staticClass:"likes"},[e.localData.isLiked?t("img",{attrs:{src:a("1881"),alt:""},on:{click:function(t){return e.toggleLike()}}}):t("img",{class:{liked:e.localData.isLiked},attrs:{src:a("6adc"),alt:""},on:{click:function(t){return e.toggleLike()}}}),t("p")])],1)])},[],!1,null,"553397ae",null).exports,m=(a("d3b7"),a("3ca3"),a("ddb0"),a("d81d"),a("b0c0"),a("4cce")),p=a("2f62"),p={name:"ReplyDetailList",props:{dataForList:{type:Object,required:!0}},created:function(){var e=this;this.$bus.$on("afterCreateReply",function(t){e.afterCreateReply(t)})},data:function(){return{localComments:[],isLoading:!0}},mixins:[o.a,o.c],methods:{fetchAllReplies:function(a){var r=this;return Object(c.a)(regeneratorRuntime.mark(function t(){var e;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=4,d.a.getTweetReplies(a);case 4:e=t.sent,e=e.data,r.localComments=e,t.next=16;break;case 10:t.prev=10,t.t0=t.catch(0),r.isLoading=!1,u.a.fire({icon:"error",title:"無法取得回覆資料，請稍後再試！"});case 16:case"end":return t.stop()}},t,null,[[0,10]])}))()},fetchAllReplyUsers:function(){var s=this;return Object(c.a)(regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all(s.localComments.map(function(){var e=Object(c.a)(regeneratorRuntime.mark(function t(e){var a,r,n;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,m.a.getUser(e.UserId);case 3:return r=t.sent,n=r.data,a=n.avatar,r=n.name,n=n.account,t.abrupt("return",Object(i.a)(Object(i.a)({},e),{},{avatar:a,name:r,account:n}));case 9:t.prev=9,t.t0=t.catch(0),s.isLoading=!1,u.a.fire({icon:"error",title:"無法取得完整回覆資料，請稍後再試！"});case 15:case"end":return t.stop()}},t,null,[[0,9]])}));return function(t){return e.apply(this,arguments)}}()));case 2:s.localComments=t.sent;case 3:case"end":return t.stop()}},t)}))()},afterCreateReply:function(t){this.localComments.push(t)}},watch:{dataForList:{handler:(r=Object(c.a)(regeneratorRuntime.mark(function t(e){var a;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=e.tweetId,this.isLoading=!0,t.next=4,this.fetchAllReplies(a);case 4:return t.next=6,this.fetchAllReplyUsers();case 6:this.isLoading=!1;case 7:case"end":return t.stop()}},t,this)})),function(t){return r.apply(this,arguments)}),deep:!0}},computed:Object(i.a)({},Object(p.b)(["currentUser"]))},p=(a("ceb6"),Object(f.a)(p,function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"container"},[a("ul",{staticClass:"tweetList"},[e.isLoading?[a("p",{staticClass:"loading"},[e._v("資料讀取中...")])]:[e.localComments.length?e._e():a("p",{staticClass:"noComment"},[e._v(" 成為第一個留言的人! ")]),e._l(e.localComments,function(t){return a("li",{key:t.id,staticClass:"commentItem"},[a("div",{staticClass:"commentInfo"},[a("div",{staticClass:"avatar"},[a("router-link",{attrs:{to:"/userprofile/"+t.UserId}},[a("img",{attrs:{src:e._f("emptyImageFilter")(t.avatar),alt:""}})])],1),a("div",{staticClass:"commentContent"},[a("div",{staticClass:"userTitle"},[a("router-link",{attrs:{to:"/userprofile/"+t.UserId}},[a("p",[e._v(e._s(t.name))])]),a("p",[e._v("@"+e._s(t.account))]),a("span",{staticClass:"mx-1"},[e._v("·")]),a("p",[e._v(e._s(e._f("fromNow")(t.createdAt)))])],1),a("div",{staticClass:"replyTarget"},[a("p",[e._v(" 回覆 "),a("span",[e._v("@"+e._s(e.dataForList.user.account))])])]),a("div",{staticClass:"textContent"},[a("p",[e._v(e._s(t.comment))])])])])])})]],2)])},[],!1,null,"222eb6b0",null)).exports,p={name:"ReplyDetail",components:{UserSidebar:n.a,RecommendedFollowers:s.a,ReplyDetailContent:l,ReplyDetailList:p},created:function(){var t=this,e=this.$route.params.id;this.fetchTweetInfo(e),this.$bus.$on("afterCreateReply",function(){t.afterCreateReply()})},data:function(){return{tweetInfo:{},dataForContent:{},dataForList:{}}},methods:{fetchTweetInfo:function(n){var s=this;return Object(c.a)(regeneratorRuntime.mark(function t(){var e,a,r;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,d.a.getTweet(n);case 3:r=t.sent,e=r.data,a=e.id,r=e.user,s.tweetInfo=Object(i.a)({},e),s.dataForContent=Object(i.a)({},e),s.dataForList={tweetId:a,user:r},t.next=15;break;case 11:t.prev=11,t.t0=t.catch(0),u.a.fire({icon:"error",title:"無法取得推文資訊，請稍後再試！"});case 15:case"end":return t.stop()}},t,null,[[0,11]])}))()},afterToggleLike:function(t){this.tweetInfo=Object(i.a)(Object(i.a)({},this.tweetInfo),{},{isLiked:t})},afterCreateReply:function(){var t=this.tweetInfo.commentsLength+1;this.tweetInfo=Object(i.a)(Object(i.a)({},this.tweetInfo),{},{commentsLength:t})}},watch:{tweetInfo:{deep:!0,handler:function(t){this.dataForContent=t}}}},p=(a("c794"),Object(f.a)(p,function(){var e=this,t=e.$createElement,t=e._self._c||t;return t("div",{staticClass:"replyDetailContent flex"},[t("UserSidebar"),t("div",{staticClass:"mainSection"},[t("div",{staticClass:"title stickyTitle"},[t("button",{staticClass:"btn",on:{click:function(t){return e.$router.back()}}},[t("img",{attrs:{src:a("b66c"),alt:""}})]),t("h1",[e._v("推文")])]),t("ReplyDetailContent",{attrs:{dataForContent:e.dataForContent},on:{afterToggleLike:e.afterToggleLike}}),t("ReplyDetailList",{attrs:{dataForList:e.dataForList}})],1),t("RecommendedFollowers",{staticClass:"recommendedFollowers"})],1)},[],!1,null,"f7b313fc",null));e.default=p.exports},6810:function(t,e,a){"use strict";a("1b98")},b66c:function(t,e,a){t.exports=a.p+"img/lastPage.7110cc7e.svg"},c3d0:function(t,e,a){},c794:function(t,e,a){"use strict";a("d23b")},ceb6:function(t,e,a){"use strict";a("c3d0")},d23b:function(t,e,a){}}]);