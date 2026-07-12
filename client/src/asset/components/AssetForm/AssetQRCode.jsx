import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export default function AssetQRCode({ assetTag, assetName }) {
  const [dataUrl, setDataUrl] = useState('')

  useEffect(() => {
    if (!assetTag) { setDataUrl(''); return }
    let active = true
    QRCode.toDataURL(assetTag, { width: 180, margin: 1 })
      .then((url) => { if (active) setDataUrl(url) })
      .catch(() => { if (active) setDataUrl('') })
    return () => { active = false }
  }, [assetTag])

  const download = () => {
    if (!dataUrl) return
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${[assetTag, assetName].filter(Boolean).join('-')}.png`.replace(/\s+/g, '-')
    link.click()
  }

  return <section className="asset-qr">
    <h3>Asset QR code</h3>
    {dataUrl ? <img className="asset-qr-code" src={dataUrl} alt={`QR code for ${assetTag}`} /> : <div className="asset-qr-code asset-qr-placeholder" aria-label="QR code unavailable" />}
    <code>{assetTag}</code>
    <button type="button" className="asset-button" onClick={download} disabled={!dataUrl}>Download QR</button>
  </section>
}
