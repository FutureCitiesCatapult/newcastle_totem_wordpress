!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e.Leaflet=e.Leaflet||{},e.Leaflet.markercluster=e.Leaflet.markercluster||{}))}(this,function(e){"use strict";var t=L.MarkerClusterGroup=L.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,clusterPane:L.Marker.prototype.options.pane,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animate:!0,animateAddingMarkers:!1,spiderfyDistanceMultiplier:1,spiderLegPolylineOptions:{weight:1.5,color:"#222",opacity:.5},chunkedLoading:!1,chunkInterval:200,chunkDelay:50,chunkProgress:null,polygonOptions:{}},initialize:function(e){L.Util.setOptions(this,e),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=L.featureGroup(),this._featureGroup.addEventParent(this),this._nonPointGroup=L.featureGroup(),this._nonPointGroup.addEventParent(this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[],this._childMarkerEventHandlers={dragstart:this._childMarkerDragStart,move:this._childMarkerMoved,dragend:this._childMarkerDragEnd};var t=L.DomUtil.TRANSITION&&this.options.animate;L.extend(this,t?this._withAnimation:this._noAnimation),this._markerCluster=t?L.MarkerCluster:L.MarkerClusterNonAnimated},addLayer:function(e){if(e instanceof L.LayerGroup)return this.addLayers([e]);if(!e.getLatLng)return this._nonPointGroup.addLayer(e),this.fire("layeradd",{layer:e}),this;if(!this._map)return this._needsClustering.push(e),this.fire("layeradd",{layer:e}),this;if(this.hasLayer(e))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(e,this._maxZoom),this.fire("layeradd",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons();var t=e,i=this._zoom;if(e.__parent)for(;t.__parent._zoom>=i;)t=t.__parent;return this._currentShownBounds.contains(t.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(e,t):this._animationAddLayerNonAnimated(e,t)),this},removeLayer:function(e){return e instanceof L.LayerGroup?this.removeLayers([e]):e.getLatLng?this._map?e.__parent?(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(e)),this._removeLayer(e,!0),this.fire("layerremove",{layer:e}),this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),e.off(this._childMarkerEventHandlers,this),this._featureGroup.hasLayer(e)&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow()),this):this:(!this._arraySplice(this._needsClustering,e)&&this.hasLayer(e)&&this._needsRemoving.push({layer:e,latlng:e._latlng}),this.fire("layerremove",{layer:e}),this):(this._nonPointGroup.removeLayer(e),this.fire("layerremove",{layer:e}),this)},addLayers:function(e,t){if(!L.Util.isArray(e))return this.addLayer(e);var i=this._featureGroup,n=this._nonPointGroup,r=this.options.chunkedLoading,s=this.options.chunkInterval,o=this.options.chunkProgress,a=e.length,h=0,l=!0,u;if(this._map){var _=(new Date).getTime(),d=L.bind(function(){for(var c=(new Date).getTime();h<a;h++){if(r&&h%200==0){if((new Date).getTime()-c>s)break}if((u=e[h])instanceof L.LayerGroup)l&&(e=e.slice(),l=!1),this._extractNonGroupLayers(u,e),a=e.length;else if(u.getLatLng){if(!this.hasLayer(u)&&(this._addLayer(u,this._maxZoom),t||this.fire("layeradd",{layer:u}),u.__parent&&2===u.__parent.getChildCount())){var p=u.__parent.getAllChildMarkers(),f=p[0]===u?p[1]:p[0];i.removeLayer(f)}}else n.addLayer(u),t||this.fire("layeradd",{layer:u})}o&&o(h,a,(new Date).getTime()-_),h===a?(this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)):setTimeout(d,this.options.chunkDelay)},this);d()}else for(var c=this._needsClustering;h<a;h++)u=e[h],u instanceof L.LayerGroup?(l&&(e=e.slice(),l=!1),this._extractNonGroupLayers(u,e),a=e.length):u.getLatLng?this.hasLayer(u)||c.push(u):n.addLayer(u);return this},removeLayers:function(e){var t,i,n=e.length,r=this._featureGroup,s=this._nonPointGroup,o=!0;if(!this._map){for(t=0;t<n;t++)i=e[t],i instanceof L.LayerGroup?(o&&(e=e.slice(),o=!1),this._extractNonGroupLayers(i,e),n=e.length):(this._arraySplice(this._needsClustering,i),s.removeLayer(i),this.hasLayer(i)&&this._needsRemoving.push({layer:i,latlng:i._latlng}),this.fire("layerremove",{layer:i}));return this}if(this._unspiderfy){this._unspiderfy();var a=e.slice(),h=n;for(t=0;t<h;t++)i=a[t],i instanceof L.LayerGroup?(this._extractNonGroupLayers(i,a),h=a.length):this._unspiderfyLayer(i)}for(t=0;t<n;t++)i=e[t],i instanceof L.LayerGroup?(o&&(e=e.slice(),o=!1),this._extractNonGroupLayers(i,e),n=e.length):i.__parent?(this._removeLayer(i,!0,!0),this.fire("layerremove",{layer:i}),r.hasLayer(i)&&(r.removeLayer(i),i.clusterShow&&i.clusterShow())):(s.removeLayer(i),this.fire("layerremove",{layer:i}));return this._topClusterLevel._recalculateBounds(),this._refreshClustersIcons(),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),this},clearLayers:function(){return this._map||(this._needsClustering=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(e){e.off(this._childMarkerEventHandlers,this),delete e.__parent},this),this._map&&this._generateInitialClusters(),this},getBounds:function(){var e=new L.LatLngBounds;this._topClusterLevel&&e.extend(this._topClusterLevel._bounds);for(var t=this._needsClustering.length-1;t>=0;t--)e.extend(this._needsClustering[t].getLatLng());return e.extend(this._nonPointGroup.getBounds()),e},eachLayer:function(e,t){var i=this._needsClustering.slice(),n=this._needsRemoving,r,s,o;for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(i),s=i.length-1;s>=0;s--){for(r=!0,o=n.length-1;o>=0;o--)if(n[o].layer===i[s]){r=!1;break}r&&e.call(t,i[s])}this._nonPointGroup.eachLayer(e,t)},getLayers:function(){var e=[];return this.eachLayer(function(t){e.push(t)}),e},getLayer:function(e){var t=null;return e=parseInt(e,10),this.eachLayer(function(i){L.stamp(i)===e&&(t=i)}),t},hasLayer:function(e){if(!e)return!1;var t,i=this._needsClustering;for(t=i.length-1;t>=0;t--)if(i[t]===e)return!0;for(i=this._needsRemoving,t=i.length-1;t>=0;t--)if(i[t].layer===e)return!1;return!(!e.__parent||e.__parent._group!==this)||this._nonPointGroup.hasLayer(e)},zoomToShowLayer:function(e,t){"function"!=typeof t&&(t=function(){});var i=function(){!e._icon&&!e.__parent._icon||this._inZoomAnimation||(this._map.off("moveend",i,this),this.off("animationend",i,this),e._icon?t():e.__parent._icon&&(this.once("spiderfied",t,this),e.__parent.spiderfy()))};e._icon&&this._map.getBounds().contains(e.getLatLng())?t():e.__parent._zoom<Math.round(this._map._zoom)?(this._map.on("moveend",i,this),this._map.panTo(e.getLatLng())):(this._map.on("moveend",i,this),this.on("animationend",i,this),e.__parent.zoomToBounds())},onAdd:function(e){this._map=e;var t,i,n;if(!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.addTo(e),this._nonPointGroup.addTo(e),this._gridClusters||this._generateInitialClusters(),this._maxLat=e.options.crs.projection.MAX_LATITUDE,t=0,i=this._needsRemoving.length;t<i;t++)n=this._needsRemoving[t],n.newlatlng=n.layer._latlng,n.layer._latlng=n.latlng;for(t=0,i=this._needsRemoving.length;t<i;t++)n=this._needsRemoving[t],this._removeLayer(n.layer,!0),n.layer._latlng=n.newlatlng;this._needsRemoving=[],this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds(),this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),i=this._needsClustering,this._needsClustering=[],this.addLayers(i,!0)},onRemove:function(e){e.off("zoomend",this._zoomEnd,this),e.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),delete this._maxLat,this._hideCoverage(),this._featureGroup.remove(),this._nonPointGroup.remove(),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(e){for(var t=e;t&&!t._icon;)t=t.__parent;return t||null},_arraySplice:function(e,t){for(var i=e.length-1;i>=0;i--)if(e[i]===t)return e.splice(i,1),!0},_removeFromGridUnclustered:function(e,t){for(var i=this._map,n=this._gridUnclustered,r=Math.floor(this._map.getMinZoom());t>=r&&n[t].removeObject(e,i.project(e.getLatLng(),t));t--);},_childMarkerDragStart:function(e){e.target.__dragStart=e.target._latlng},_childMarkerMoved:function(e){if(!this._ignoreMove&&!e.target.__dragStart){var t=e.target._popup&&e.target._popup.isOpen();this._moveChild(e.target,e.oldLatLng,e.latlng),t&&e.target.openPopup()}},_moveChild:function(e,t,i){e._latlng=t,this.removeLayer(e),e._latlng=i,this.addLayer(e)},_childMarkerDragEnd:function(e){e.target.__dragStart&&this._moveChild(e.target,e.target.__dragStart,e.target._latlng),delete e.target.__dragStart},_removeLayer:function(e,t,i){var n=this._gridClusters,r=this._gridUnclustered,s=this._featureGroup,o=this._map,a=Math.floor(this._map.getMinZoom());t&&this._removeFromGridUnclustered(e,this._maxZoom);var h=e.__parent,l=h._markers,u;for(this._arraySplice(l,e);h&&(h._childCount--,h._boundsNeedUpdate=!0,!(h._zoom<a));)t&&h._childCount<=1?(u=h._markers[0]===e?h._markers[1]:h._markers[0],n[h._zoom].removeObject(h,o.project(h._cLatLng,h._zoom)),r[h._zoom].addObject(u,o.project(u.getLatLng(),h._zoom)),this._arraySplice(h.__parent._childClusters,h),h.__parent._markers.push(u),u.__parent=h.__parent,h._icon&&(s.removeLayer(h),i||s.addLayer(u))):h._iconNeedsUpdate=!0,h=h.__parent;delete e.__parent},_isOrIsParent:function(e,t){for(;t;){if(e===t)return!0;t=t.parentNode}return!1},fire:function(e,t,i){if(t&&t.layer instanceof L.MarkerCluster){if(t.originalEvent&&this._isOrIsParent(t.layer._icon,t.originalEvent.relatedTarget))return;e="cluster"+e}L.FeatureGroup.prototype.fire.call(this,e,t,i)},listens:function(e,t){return L.FeatureGroup.prototype.listens.call(this,e,t)||L.FeatureGroup.prototype.listens.call(this,"cluster"+e,t)},_defaultIconCreateFunction:function(e){var t=e.getChildCount(),i=" marker-cluster-";return i+=t<10?"small":t<100?"medium":"large",new L.DivIcon({html:"<div><span>"+t+"</span></div>",className:"marker-cluster"+i,iconSize:new L.Point(40,40)})},_bindEvents:function(){var e=this._map,t=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,n=this.options.zoomToBoundsOnClick;(t||n)&&this.on("clusterclick",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),e.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(e){for(var t=e.layer,i=t;1===i._childClusters.length;)i=i._childClusters[0];i._zoom===this._maxZoom&&i._childCount===t._childCount&&this.options.spiderfyOnMaxZoom?t.spiderfy():this.options.zoomToBoundsOnClick&&t.zoomToBounds(),e.originalEvent&&13===e.originalEvent.keyCode&&this._map._container.focus()},_showCoverage:function(e){var t=this._map;this._inZoomAnimation||(this._shownPolygon&&t.removeLayer(this._shownPolygon),e.layer.getChildCount()>2&&e.layer!==this._spiderfied&&(this._shownPolygon=new L.Polygon(e.layer.getConvexHull(),this.options.polygonOptions),t.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var e=this.options.spiderfyOnMaxZoom,t=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,n=this._map;(e||i)&&this.off("clusterclick",this._zoomOrSpiderfy,this),t&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),n.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=Math.round(this._map._zoom),this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var e=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,Math.round(this._map._zoom),e),this._currentShownBounds=e}},_generateInitialClusters:function(){var e=Math.ceil(this._map.getMaxZoom()),t=Math.floor(this._map.getMinZoom()),i=this.options.maxClusterRadius,n=i;"function"!=typeof i&&(n=function(){return i}),null!==this.options.disableClusteringAtZoom&&(e=this.options.disableClusteringAtZoom-1),this._maxZoom=e,this._gridClusters={},this._gridUnclustered={};for(var r=e;r>=t;r--)this._gridClusters[r]=new L.DistanceGrid(n(r)),this._gridUnclustered[r]=new L.DistanceGrid(n(r));this._topClusterLevel=new this._markerCluster(this,t-1)},_addLayer:function(e,t){var i=this._gridClusters,n=this._gridUnclustered,r=Math.floor(this._map.getMinZoom()),s,o;for(this.options.singleMarkerMode&&this._overrideMarkerIcon(e),e.on(this._childMarkerEventHandlers,this);t>=r;t--){s=this._map.project(e.getLatLng(),t);var a=i[t].getNearObject(s);if(a)return a._addChild(e),void(e.__parent=a);if(a=n[t].getNearObject(s)){var h=a.__parent;h&&this._removeLayer(a,!1);var l=new this._markerCluster(this,t,a,e);i[t].addObject(l,this._map.project(l._cLatLng,t)),a.__parent=l,e.__parent=l;var u=l;for(o=t-1;o>h._zoom;o--)u=new this._markerCluster(this,o,u),i[o].addObject(u,this._map.project(a.getLatLng(),o));return h._addChild(u),void this._removeFromGridUnclustered(a,t)}n[t].addObject(e,s)}this._topClusterLevel._addChild(e),e.__parent=this._topClusterLevel},_refreshClustersIcons:function(){this._featureGroup.eachLayer(function(e){e instanceof L.MarkerCluster&&e._iconNeedsUpdate&&e._updateIcon()})},_enqueue:function(e){this._queue.push(e),this._queueTimeout||(this._queueTimeout=setTimeout(L.bind(this._processQueue,this),300))},_processQueue:function(){for(var e=0;e<this._queue.length;e++)this._queue[e].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){var e=Math.round(this._map._zoom);this._processQueue(),this._zoom<e&&this._currentShownBounds.intersects(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,e)):this._zoom>e?(this._animationStart(),this._animationZoomOut(this._zoom,e)):this._moveEnd()},_getExpandedVisibleBounds:function(){return this.options.removeOutsideVisibleBounds?L.Browser.mobile?this._checkBoundsMaxLat(this._map.getBounds()):this._checkBoundsMaxLat(this._map.getBounds().pad(1)):this._mapBoundsInfinite},_checkBoundsMaxLat:function(e){var t=this._maxLat;return void 0!==t&&(e.getNorth()>=t&&(e._northEast.lat=1/0),e.getSouth()<=-t&&(e._southWest.lat=-1/0)),e},_animationAddLayerNonAnimated:function(e,t){if(t===e)this._featureGroup.addLayer(e);else if(2===t._childCount){t._addToMap();var i=t.getAllChildMarkers();this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])}else t._updateIcon()},_extractNonGroupLayers:function(e,t){var i=e.getLayers(),n=0,r;for(t=t||[];n<i.length;n++)r=i[n],r instanceof L.LayerGroup?this._extractNonGroupLayers(r,t):t.push(r);return t},_overrideMarkerIcon:function(e){return e.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[e]}})}});L.MarkerClusterGroup.include({_mapBoundsInfinite:new L.LatLngBounds(new L.LatLng(-1/0,-1/0),new L.LatLng(1/0,1/0))}),L.MarkerClusterGroup.include({_noAnimation:{_animationStart:function(){},_animationZoomIn:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationZoomOut:function(e,t){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationAddLayer:function(e,t){this._animationAddLayerNonAnimated(e,t)}},_withAnimation:{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationZoomIn:function(e,t){var i=this._getExpandedVisibleBounds(),n=this._featureGroup,r=Math.floor(this._map.getMinZoom()),s;this._ignoreMove=!0,this._topClusterLevel._recursively(i,e,r,function(r){var o=r._latlng,a=r._markers,h;for(i.contains(o)||(o=null),r._isSingleParent()&&e+1===t?(n.removeLayer(r),r._recursivelyAddChildrenToMap(null,t,i)):(r.clusterHide(),r._recursivelyAddChildrenToMap(o,t,i)),s=a.length-1;s>=0;s--)h=a[s],i.contains(h._latlng)||n.removeLayer(h)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(i,t),n.eachLayer(function(e){e instanceof L.MarkerCluster||!e._icon||e.clusterShow()}),this._topClusterLevel._recursively(i,e,t,function(e){e._recursivelyRestoreChildPositions(t)}),this._ignoreMove=!1,this._enqueue(function(){this._topClusterLevel._recursively(i,e,r,function(e){n.removeLayer(e),e.clusterShow()}),this._animationEnd()})},_animationZoomOut:function(e,t){this._animationZoomOutSingle(this._topClusterLevel,e-1,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,t,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,Math.floor(this._map.getMinZoom()),e,this._getExpandedVisibleBounds())},_animationAddLayer:function(e,t){var i=this,n=this._featureGroup;n.addLayer(e),t!==e&&(t._childCount>2?(t._updateIcon(),this._forceLayout(),this._animationStart(),e._setPos(this._map.latLngToLayerPoint(t.getLatLng())),e.clusterHide(),this._enqueue(function(){n.removeLayer(e),e.clusterShow(),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(t,this._map.getMaxZoom(),this._zoom)))}},_animationZoomOutSingle:function(e,t,i){var n=this._getExpandedVisibleBounds(),r=Math.floor(this._map.getMinZoom());e._recursivelyAnimateChildrenInAndAddSelfToMap(n,r,t+1,i);var s=this;this._forceLayout(),e._recursivelyBecomeVisible(n,i),this._enqueue(function(){if(1===e._childCount){var o=e._markers[0];this._ignoreMove=!0,o.setLatLng(o.getLatLng()),this._ignoreMove=!1,o.clusterShow&&o.clusterShow()}else e._recursively(n,i,r,function(e){e._recursivelyRemoveChildrenFromMap(n,r,t+1)});s._animationEnd()})},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_forceLayout:function(){L.Util.falseFn(document.body.offsetWidth)}}),L.markerClusterGroup=function(e){return new L.MarkerClusterGroup(e)};var i=L.MarkerCluster=L.Marker.extend({options:L.Icon.prototype.options,initialize:function(e,t,i,n){L.Marker.prototype.initialize.call(this,i?i._cLatLng||i.getLatLng():new L.LatLng(0,0),{icon:this,pane:e.options.clusterPane}),this._group=e,this._zoom=t,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._bounds=new L.LatLngBounds,i&&this._addChild(i),n&&this._addChild(n)},getAllChildMarkers:function(e){e=e||[];for(var t=this._childClusters.length-1;t>=0;t--)this._childClusters[t].getAllChildMarkers(e);for(var i=this._markers.length-1;i>=0;i--)e.push(this._markers[i]);return e},getChildCount:function(){return this._childCount},zoomToBounds:function(e){for(var t=this._childClusters.slice(),i=this._group._map,n=i.getBoundsZoom(this._bounds),r=this._zoom+1,s=i.getZoom(),o;t.length>0&&n>r;){r++;var a=[];for(o=0;o<t.length;o++)a=a.concat(t[o]._childClusters);t=a}n>r?this._group._map.setView(this._latlng,r):n<=s?this._group._map.setView(this._latlng,s+1):this._group._map.fitBounds(this._bounds,e)},getBounds:function(){var e=new L.LatLngBounds;return e.extend(this._bounds),e},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(e,t){this._iconNeedsUpdate=!0,this._boundsNeedUpdate=!0,this._setClusterCenter(e),e instanceof L.MarkerCluster?(t||(this._childClusters.push(e),e.__parent=this),this._childCount+=e._childCount):(t||this._markers.push(e),this._childCount++),this.__parent&&this.__parent._addChild(e,!0)},_setClusterCenter:function(e){this._cLatLng||(this._cLatLng=e._cLatLng||e._latlng)},_resetBounds:function(){var e=this._bounds;e._southWest&&(e._southWest.lat=1/0,e._southWest.lng=1/0),e._northEast&&(e._northEast.lat=-1/0,e._northEast.lng=-1/0)},_recalculateBounds:function(){var e=this._markers,t=this._childClusters,i=0,n=0,r=this._childCount,s,o,a,h;if(0!==r){for(this._resetBounds(),s=0;s<e.length;s++)a=e[s]._latlng,this._bounds.extend(a),i+=a.lat,n+=a.lng;for(s=0;s<t.length;s++)o=t[s],o._boundsNeedUpdate&&o._recalculateBounds(),this._bounds.extend(o._bounds),a=o._wLatLng,h=o._childCount,i+=a.lat*h,n+=a.lng*h;this._latlng=this._wLatLng=new L.LatLng(i/r,n/r),this._boundsNeedUpdate=!1}},_addToMap:function(e){e&&(this._backupLatlng=this._latlng,this.setLatLng(e)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(e,t,i){this._recursively(e,this._group._map.getMinZoom(),i-1,function(e){var i=e._markers,n,r;for(n=i.length-1;n>=0;n--)r=i[n],r._icon&&(r._setPos(t),r.clusterHide())},function(e){var i=e._childClusters,n,r;for(n=i.length-1;n>=0;n--)r=i[n],r._icon&&(r._setPos(t),r.clusterHide())})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(e,t,i,n){this._recursively(e,n,t,function(r){r._recursivelyAnimateChildrenIn(e,r._group._map.latLngToLayerPoint(r.getLatLng()).round(),i),r._isSingleParent()&&i-1===n?(r.clusterShow(),r._recursivelyRemoveChildrenFromMap(e,t,i)):r.clusterHide(),r._addToMap()})},_recursivelyBecomeVisible:function(e,t){this._recursively(e,this._group._map.getMinZoom(),t,null,function(e){e.clusterShow()})},_recursivelyAddChildrenToMap:function(e,t,i){this._recursively(i,this._group._map.getMinZoom()-1,t,function(n){if(t!==n._zoom)for(var r=n._markers.length-1;r>=0;r--){var s=n._markers[r];i.contains(s._latlng)&&(e&&(s._backupLatlng=s.getLatLng(),s.setLatLng(e),s.clusterHide&&s.clusterHide()),n._group._featureGroup.addLayer(s))}},function(t){t._addToMap(e)})},_recursivelyRestoreChildPositions:function(e){for(var t=this._markers.length-1;t>=0;t--){var i=this._markers[t];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(e-1===this._zoom)for(var n=this._childClusters.length-1;n>=0;n--)this._childClusters[n]._restorePosition();else for(var r=this._childClusters.length-1;r>=0;r--)this._childClusters[r]._recursivelyRestoreChildPositions(e)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(e,t,i,n){var r,s;this._recursively(e,t-1,i-1,function(e){for(s=e._markers.length-1;s>=0;s--)r=e._markers[s],n&&n.contains(r._latlng)||(e._group._featureGroup.removeLayer(r),r.clusterShow&&r.clusterShow())},function(e){for(s=e._childClusters.length-1;s>=0;s--)r=e._childClusters[s],n&&n.contains(r._latlng)||(e._group._featureGroup.removeLayer(r),r.clusterShow&&r.clusterShow())})},_recursively:function(e,t,i,n,r){var s=this._childClusters,o=this._zoom,a,h;if(t<=o&&(n&&n(this),r&&o===i&&r(this)),o<t||o<i)for(a=s.length-1;a>=0;a--)h=s[a],e.intersects(h._bounds)&&h._recursively(e,t,i,n,r)},_isSingleParent:function(){return this._childClusters.length>0&&this._childClusters[0]._childCount===this._childCount}});L.Marker.include({clusterHide:function(){return this.options.opacityWhenUnclustered=this.options.opacity||1,this.setOpacity(0)},clusterShow:function(){var e=this.setOpacity(this.options.opacity||this.options.opacityWhenUnclustered);return delete this.options.opacityWhenUnclustered,e}}),L.DistanceGrid=function(e){this._cellSize=e,this._sqCellSize=e*e,this._grid={},this._objectPoint={}},L.DistanceGrid.prototype={addObject:function(e,t){var i=this._getCoord(t.x),n=this._getCoord(t.y),r=this._grid,s=r[n]=r[n]||{},o=s[i]=s[i]||[],a=L.Util.stamp(e);this._objectPoint[a]=t,o.push(e)},updateObject:function(e,t){this.removeObject(e),this.addObject(e,t)},removeObject:function(e,t){var i=this._getCoord(t.x),n=this._getCoord(t.y),r=this._grid,s=r[n]=r[n]||{},o=s[i]=s[i]||[],a,h;for(delete this._objectPoint[L.Util.stamp(e)],a=0,h=o.length;a<h;a++)if(o[a]===e)return o.splice(a,1),1===h&&delete s[i],!0},eachObject:function(e,t){var i,n,r,s,o,a,h,l=this._grid;for(i in l){o=l[i];for(n in o)for(a=o[n],r=0,s=a.length;r<s;r++)(h=e.call(t,a[r]))&&(r--,s--)}},getNearObject:function(e){var t=this._getCoord(e.x),i=this._getCoord(e.y),n,r,s,o,a,h,l,u,_=this._objectPoint,d=this._sqCellSize,c=null;for(n=i-1;n<=i+1;n++)if(o=this._grid[n])for(r=t-1;r<=t+1;r++)if(a=o[r])for(s=0,h=a.length;s<h;s++)l=a[s],((u=this._sqDist(_[L.Util.stamp(l)],e))<d||u<=d&&null===c)&&(d=u,c=l);return c},_getCoord:function(e){var t=Math.floor(e/this._cellSize);return isFinite(t)?t:e},_sqDist:function(e,t){var i=t.x-e.x,n=t.y-e.y;return i*i+n*n}},function(){L.QuickHull={getDistant:function(e,t){var i=t[1].lat-t[0].lat;return(t[0].lng-t[1].lng)*(e.lat-t[0].lat)+i*(e.lng-t[0].lng)},findMostDistantPointFromBaseLine:function(e,t){var i=0,n=null,r=[],s,o,a;for(s=t.length-1;s>=0;s--)o=t[s],(a=this.getDistant(o,e))>0&&(r.push(o),a>i&&(i=a,n=o));return{maxPoint:n,newPoints:r}},buildConvexHull:function(e,t){var i=[],n=this.findMostDistantPointFromBaseLine(e,t);return n.maxPoint?(i=i.concat(this.buildConvexHull([e[0],n.maxPoint],n.newPoints)),i=i.concat(this.buildConvexHull([n.maxPoint,e[1]],n.newPoints))):[e[0]]},getConvexHull:function(e){var t=!1,i=!1,n=!1,r=!1,s=null,o=null,a=null,h=null,l=null,u=null,_;for(_=e.length-1;_>=0;_--){var d=e[_];(!1===t||d.lat>t)&&(s=d,t=d.lat),(!1===i||d.lat<i)&&(o=d,i=d.lat),(!1===n||d.lng>n)&&(a=d,n=d.lng),(!1===r||d.lng<r)&&(h=d,r=d.lng)}return i!==t?(u=o,l=s):(u=h,l=a),[].concat(this.buildConvexHull([u,l],e),this.buildConvexHull([l,u],e))}}}(),L.MarkerCluster.include({getConvexHull:function(){var e=this.getAllChildMarkers(),t=[],i,n;for(n=e.length-1;n>=0;n--)i=e[n].getLatLng(),t.push(i);return L.QuickHull.getConvexHull(t)}}),L.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,_circleStartAngle:0,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(this._group._spiderfied!==this&&!this._group._inZoomAnimation){var e=this.getAllChildMarkers(),t=this._group,i=t._map,n=i.latLngToLayerPoint(this._latlng),r;this._group._unspiderfy(),this._group._spiderfied=this,e.length>=this._circleSpiralSwitchover?r=this._generatePointsSpiral(e.length,n):(n.y+=10,r=this._generatePointsCircle(e.length,n)),this._animationSpiderfy(e,r)}},unspiderfy:function(e){this._group._inZoomAnimation||(this._animationUnspiderfy(e),this._group._spiderfied=null)},_generatePointsCircle:function(e,t){var i=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+e),n=i/this._2PI,r=this._2PI/e,s=[],o,a;for(n=Math.max(n,35),s.length=e,o=0;o<e;o++)a=this._circleStartAngle+o*r,s[o]=new L.Point(t.x+n*Math.cos(a),t.y+n*Math.sin(a))._round();return s},_generatePointsSpiral:function(e,t){var i=this._group.options.spiderfyDistanceMultiplier,n=i*this._spiralLengthStart,r=i*this._spiralFootSeparation,s=i*this._spiralLengthFactor*this._2PI,o=0,a=[],h;for(a.length=e,h=e;h>=0;h--)h<e&&(a[h]=new L.Point(t.x+n*Math.cos(o),t.y+n*Math.sin(o))._round()),o+=r/n+5e-4*h,n+=s/o;return a},_noanimationUnspiderfy:function(){var e=this._group,t=e._map,i=e._featureGroup,n=this.getAllChildMarkers(),r,s;for(e._ignoreMove=!0,this.setOpacity(1),s=n.length-1;s>=0;s--)r=n[s],i.removeLayer(r),r._preSpiderfyLatlng&&(r.setLatLng(r._preSpiderfyLatlng),delete r._preSpiderfyLatlng),r.setZIndexOffset&&r.setZIndexOffset(0),r._spiderLeg&&(t.removeLayer(r._spiderLeg),delete r._spiderLeg);e.fire("unspiderfied",{cluster:this,markers:n}),e._ignoreMove=!1,e._spiderfied=null}}),L.MarkerClusterNonAnimated=L.MarkerCluster.extend({_animationSpiderfy:function(e,t){var i=this._group,n=i._map,r=i._featureGroup,s=this._group.options.spiderLegPolylineOptions,o,a,h,l;for(i._ignoreMove=!0,o=0;o<e.length;o++)l=n.layerPointToLatLng(t[o]),a=e[o],h=new L.Polyline([this._latlng,l],s),n.addLayer(h),a._spiderLeg=h,a._preSpiderfyLatlng=a._latlng,a.setLatLng(l),a.setZIndexOffset&&a.setZIndexOffset(1e6),r.addLayer(a);this.setOpacity(.3),i._ignoreMove=!1,i.fire("spiderfied",{cluster:this,markers:e})},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),L.MarkerCluster.include({_animationSpiderfy:function(e,t){var i=this,n=this._group,r=n._map,s=n._featureGroup,o=this._latlng,a=r.latLngToLayerPoint(o),h=L.Path.SVG,l=L.extend({},this._group.options.spiderLegPolylineOptions),u=l.opacity,_,d,c,p,f,m;for(void 0===u&&(u=L.MarkerClusterGroup.prototype.options.spiderLegPolylineOptions.opacity),h?(l.opacity=0,l.className=(l.className||"")+" leaflet-cluster-spider-leg"):l.opacity=u,n._ignoreMove=!0,_=0;_<e.length;_++)d=e[_],m=r.layerPointToLatLng(t[_]),c=new L.Polyline([o,m],l),r.addLayer(c),d._spiderLeg=c,h&&(p=c._path,f=p.getTotalLength()+.1,p.style.strokeDasharray=f,p.style.strokeDashoffset=f),d.setZIndexOffset&&d.setZIndexOffset(1e6),d.clusterHide&&d.clusterHide(),s.addLayer(d),d._setPos&&d._setPos(a);for(n._forceLayout(),n._animationStart(),_=e.length-1;_>=0;_--)m=r.layerPointToLatLng(t[_]),d=e[_],d._preSpiderfyLatlng=d._latlng,d.setLatLng(m),d.clusterShow&&d.clusterShow(),h&&(c=d._spiderLeg,p=c._path,p.style.strokeDashoffset=0,c.setStyle({opacity:u}));this.setOpacity(.3),n._ignoreMove=!1,setTimeout(function(){n._animationEnd(),n.fire("spiderfied",{cluster:i,markers:e})},200)},_animationUnspiderfy:function(e){var t=this,i=this._group,n=i._map,r=i._featureGroup,s=e?n._latLngToNewLayerPoint(this._latlng,e.zoom,e.center):n.latLngToLayerPoint(this._latlng),o=this.getAllChildMarkers(),a=L.Path.SVG,h,l,u,_,d,c;for(i._ignoreMove=!0,i._animationStart(),this.setOpacity(1),l=o.length-1;l>=0;l--)h=o[l],h._preSpiderfyLatlng&&(h.closePopup(),h.setLatLng(h._preSpiderfyLatlng),delete h._preSpiderfyLatlng,c=!0,h._setPos&&(h._setPos(s),c=!1),h.clusterHide&&(h.clusterHide(),c=!1),c&&r.removeLayer(h),a&&(u=h._spiderLeg,_=u._path,d=_.getTotalLength()+.1,_.style.strokeDashoffset=d,u.setStyle({opacity:0})));i._ignoreMove=!1,setTimeout(function(){var e=0;for(l=o.length-1;l>=0;l--)h=o[l],h._spiderLeg&&e++;for(l=o.length-1;l>=0;l--)h=o[l],h._spiderLeg&&(h.clusterShow&&h.clusterShow(),h.setZIndexOffset&&h.setZIndexOffset(0),e>1&&r.removeLayer(h),n.removeLayer(h._spiderLeg),delete h._spiderLeg);i._animationEnd(),i.fire("unspiderfied",{cluster:t,markers:o})},200)}}),L.MarkerClusterGroup.include({_spiderfied:null,unspiderfy:function(){this._unspiderfy.apply(this,arguments)},_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),L.Browser.touch||this._map.getRenderer(this)},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._map.off("zoomend",this._noanimationUnspiderfy,this),this._noanimationUnspiderfy()},
_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(e){L.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(e))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(e){this._spiderfied&&this._spiderfied.unspiderfy(e)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(e){e._spiderLeg&&(this._featureGroup.removeLayer(e),e.clusterShow&&e.clusterShow(),e.setZIndexOffset&&e.setZIndexOffset(0),this._map.removeLayer(e._spiderLeg),delete e._spiderLeg)}}),L.MarkerClusterGroup.include({refreshClusters:function(e){return e?e instanceof L.MarkerClusterGroup?e=e._topClusterLevel.getAllChildMarkers():e instanceof L.LayerGroup?e=e._layers:e instanceof L.MarkerCluster?e=e.getAllChildMarkers():e instanceof L.Marker&&(e=[e]):e=this._topClusterLevel.getAllChildMarkers(),this._flagParentsIconsNeedUpdate(e),this._refreshClustersIcons(),this.options.singleMarkerMode&&this._refreshSingleMarkerModeMarkers(e),this},_flagParentsIconsNeedUpdate:function(e){var t,i;for(t in e)for(i=e[t].__parent;i;)i._iconNeedsUpdate=!0,i=i.__parent},_refreshSingleMarkerModeMarkers:function(e){var t,i;for(t in e)i=e[t],this.hasLayer(i)&&i.setIcon(this._overrideMarkerIcon(i))}}),L.Marker.include({refreshIconOptions:function(e,t){var i=this.options.icon;return L.setOptions(i,e),this.setIcon(i),t&&this.__parent&&this.__parent._group.refreshClusters(this),this}}),e.MarkerClusterGroup=t,e.MarkerCluster=i});