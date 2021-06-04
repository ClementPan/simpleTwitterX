(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-101578b4"],{"0ac1":function(e,t,r){},"60e1":function(e,t,r){"use strict";r("7173")},6431:function(e,t,r){},7173:function(e,t,r){},b66c:function(e,t,r){e.exports=r.p+"img/lastPage.7110cc7e.svg"},cc95:function(e,t,r){"use strict";r.r(t);var a=r("1da1"),n=(r("96cf"),r("c8e4")),s=r("cfa6"),i=r("5530"),o=(r("d81d"),r("4cce")),c=r("2708"),l=r("2fa3"),u=r("2f62"),f={name:"UserFollowersList",mixins:[c.a],props:{Followings:{type:Array,required:!0}},data:function(){return{followings:[],isProcessing:!1}},computed:Object(i.a)({},Object(u.b)(["currentUser"])),watch:{Followings:function(e){this.fetchFollowings(e)}},methods:{fetchFollowings:function(){this.followings=this.Followings},addFollowing:function(n){var s=this;return Object(a.a)(regeneratorRuntime.mark(function e(){var t,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,s.isProcessing=!0,t=n.followingId,e.next=5,o.a.followUser(t);case 5:if(r=e.sent,"success"!==(r=r.data).status)throw new Error(r.message);e.next=9;break;case 9:s.renderAfterFollowToggle(n),r=s.$route.params.id,s.$socket.emit("follow",{userId:r,currentUserId:s.currentUser.id}),l.a.fire({icon:"success",title:"追蹤成功！"}),s.isProcessing=!1,e.next=21;break;case 16:e.prev=16,e.t0=e.catch(0),s.isProcessing=!1,l.a.fire({icon:"error",title:"無法執行動作，請稍後再試！"});case 21:case"end":return e.stop()}},e,null,[[0,16]])}))()},deleteFollowing:function(r){var n=this;return Object(a.a)(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,n.isProcessing=!0,e.next=4,o.a.unfollowUser(r.followingId);case 4:if(t=e.sent,"success"!==(t=t.data).status)throw new Error(t.message);e.next=8;break;case 8:n.renderAfterFollowToggle(r),l.a.fire({icon:"success",title:"取消追蹤成功！"}),n.isProcessing=!1,e.next=18;break;case 13:e.prev=13,e.t0=e.catch(0),n.isProcessing=!1,l.a.fire({icon:"error",title:"無法取消追蹤，請稍後再試！"});case 18:case"end":return e.stop()}},e,null,[[0,13]])}))()},renderAfterFollowToggle:function(t){this.followings=this.followings.map(function(e){return e.followingId===t.followingId?Object(i.a)(Object(i.a)({},e),{},{isFollowing:!t.isFollowing}):e})}}},d=(r("d516"),r("2877")),c=Object(d.a)(f,function(){var r=this,e=r.$createElement,n=r._self._c||e;return n("div",{staticClass:"container"},r._l(r.followings,function(t){return n("div",{key:t.followingId,staticClass:"following-container"},[n("div",{staticClass:"avatar"},[n("img",{attrs:{src:r._f("emptyImageFilter")(t.avatar),alt:""}})]),n("div",{staticClass:"follower-info"},[n("div",{staticClass:"isfollowed-info"},[n("div",{staticClass:"follower-title"},[n("router-link",{attrs:{to:{name:"user-profile",params:{id:t.followingId}}}},[n("div",{staticClass:"name"},[r._v(r._s(t.name))])]),n("div",{staticClass:"account"},[r._v("@"+r._s(t.account))])],1),n("div",{staticClass:"toggleFollow"},[t.isFollowing?n("button",{staticClass:"btn isFollowing",attrs:{disabled:r.isProcessing},on:{click:function(e){return e.preventDefault(),e.stopPropagation(),r.deleteFollowing(t)}}},[r._v(" 正在跟隨 ")]):n("button",{staticClass:"btn",attrs:{disabled:r.isProcessing},on:{click:function(e){return e.preventDefault(),e.stopPropagation(),r.addFollowing(t)}}},[r._v(" 跟隨 ")])])]),n("p",[r._v(r._s(t.introduction))])])])}),0)},[],!1,null,"5eb82727",null).exports,u=r("999e"),f=r("b572"),f={name:"UserFollowing",components:{UserSidebar:n.a,UserFollowNavtabs:s.a,UserFollowingsList:c,RecommendedFollowers:u.a,Spinner:f.a},beforeRouteEnter:function(r,e,t){return Object(a.a)(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:try{t(function(e){var t=r.params.id;e.fetchUser(t),e.fetchFollowings(t),e.fetchingData=!0})}catch(e){}case 1:case"end":return e.stop()}},e)}))()},beforeRouteUpdate:function(r,e,n){var s=this;return Object(a.a)(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,s.fetchingData&&n(),t=r.params.id,e.next=5,s.fetchUser(t);case 5:s.fetchFollowings(t),n(),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(0);case 12:case"end":return e.stop()}},e,null,[[0,9]])}))()},data:function(){return{followings:[],user:{},isLoading:!0,fetchingData:!1}},created:function(){var e=this.$route.params.id;this.fetchFollowings(e)},methods:{fetchUser:function(r){var n=this;return Object(a.a)(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o.a.getUser(r);case 3:t=e.sent,t=t.data,n.user=t,n.isLoading=!1,e.next=14;break;case 9:e.prev=9,e.t0=e.catch(0),n.isLoading=!1,l.a.fire({icon:"error",title:"無法取得使用者資料，請稍後再試！"});case 14:case"end":return e.stop()}},e,null,[[0,9]])}))()},fetchFollowings:function(r){var n=this;return Object(a.a)(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,o.a.getUserFollowings(r);case 3:t=e.sent,t=t.data,n.followings=t,n.isLoading=!1,e.next=15;break;case 10:e.prev=10,e.t0=e.catch(0),n.isLoading=!1,l.a.fire({icon:"error",title:"無法取得正在跟隨資料，請稍後再試！"});case 15:case"end":return e.stop()}},e,null,[[0,10]])}))()}}},f=(r("60e1"),Object(d.a)(f,function(){var t=this,e=t.$createElement,e=t._self._c||e;return e("div",{attrs:{id:"UserFollowers flex"}},[t.isLoading?e("Spinner"):[e("UserSidebar"),e("div",{staticClass:"mainSection"},[e("div",{staticClass:"title"},[e("div",{staticClass:"pre-page"},[e("button",{staticClass:"btn",on:{click:function(e){return t.$router.back()}}},[e("img",{attrs:{src:r("b66c"),alt:""}})])]),e("div",{staticClass:"title-info"},[e("div",{staticClass:"name"},[t._v(t._s(t.user.name))]),e("div",{staticClass:"tweet-count"},[t._v(t._s(t.user.tweetCount)+"推文")])])]),e("div",{staticClass:"admin-users-card"},[e("UserFollowNavtabs",{attrs:{userData:t.user}}),e("UserFollowingsList",{attrs:{followings:t.followings}})],1)]),e("RecommendedFollowers")]],2)},[],!1,null,"d5f6eb40",null));t.default=f.exports},cfa6:function(e,t,r){"use strict";var n={name:"UserFollowNavtabs",props:{userData:{type:Object,required:!0}}},r=(r("f79c"),r("2877")),n=Object(r.a)(n,function(){var e=this,t=e.$createElement,t=e._self._c||t;return t("ul",{staticClass:"nav nav-tabs"},[t("li",{staticClass:"nav-item"},[t("router-link",{staticClass:"nav-link",attrs:{to:{name:"user-profile-followers",params:{id:e.userData.id}}}},[e._v(" 跟隨者 ")])],1),t("li",{staticClass:"nav-item"},[t("router-link",{staticClass:"nav-link",attrs:{to:{name:"user-profile-following",params:{id:e.userData.id}}}},[e._v(" 正在跟隨 ")])],1)])},[],!1,null,"544e26b4",null);t.a=n.exports},d516:function(e,t,r){"use strict";r("0ac1")},f79c:function(e,t,r){"use strict";r("6431")}}]);