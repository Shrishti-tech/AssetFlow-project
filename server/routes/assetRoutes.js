import { Router } from 'express'
import { createAsset, deleteAsset, getAsset, listAssets, updateAsset } from '../controllers/assetController.js'
import { auth } from '../middleware/auth.js'
import { authorize } from '../middleware/roleMiddleware.js'

export const assetRoutes = Router()

assetRoutes.use(auth)
assetRoutes.route('/').get(listAssets).post(authorize('Admin', 'Asset Manager'), createAsset)
assetRoutes.route('/:id').get(getAsset).put(authorize('Admin', 'Asset Manager'), updateAsset).delete(authorize('Admin', 'Asset Manager'), deleteAsset)
