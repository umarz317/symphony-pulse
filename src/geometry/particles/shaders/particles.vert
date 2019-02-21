attribute float life;

uniform float size;
uniform float scale;

uniform vec3 uSpawnStart;
uniform vec3 uSpawnDestination;
uniform float uDeltaTime;

uniform vec2 uOriginOffset;
uniform float uTime;
uniform sampler2D positionTexture;

varying float vLifeAttr;
varying float vLife;

#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <color_vertex>
	#include <begin_vertex>

	vec4 positionData = texture2D(positionTexture, position.xy);
	
	vLifeAttr = life;
	vLife = positionData.w;

	transformed.xyz = positionData.xyz;

	transformed.xz -= uOriginOffset;

	//transformed.xyz += uSpawnStart.xyz;

	#include <morphtarget_vertex>
	#include <project_vertex>

	gl_PointSize = 2.8;

	// #ifdef USE_SIZEATTENUATION

	// 	bool isPerspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 );

	// 	if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );

	// #endif

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>

}
