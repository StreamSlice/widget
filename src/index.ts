/**
 * StreamSlice Widget Library
 * 
 * A floating video player widget with Amazon IVS support
 */

export { StreamSlice } from './StreamSlice';
export type {
  StreamSliceConfig,
  StreamSliceError,
  WindowPosition,
  WindowSize,
  PlayerState,
  PlaylistResponse,
} from './types';

// Default export for UMD builds
import { StreamSlice } from './StreamSlice';
export default StreamSlice;
