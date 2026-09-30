import Link from "next/link";
import { ExternalLink, Image as ImageIcon, Megaphone, Package, Quote, Store, Upload } from "lucide-react";
import { products } from "@/src/config/brand";
import { getAdminCmsContent } from "@/src/cms/content";
import { requireAdmin } from "@/src/cms/auth";
import { addMediaUrl, deleteMedia, deleteOffer, deletePartner, deleteReview, logoutAdmin, saveOffer, savePartner, saveProductOverride, saveReview, saveSiteSettings, uploadMedia } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

function Status({ published }: { published: boolean }) {
  return <span className={published ? "admin-status live" : "admin-status draft"}>{published ? "Published" : "Draft"}</span>;
}
function Empty({ children }: { children: React.ReactNode }) {
  return <p className="admin-empty">{children}</p>;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ notice?: string; error?: string }> }) {
  const session = await requireAdmin();
  const data = await getAdminCmsContent();
  const query = await searchParams;
  const overrideBySlug = new Map(data.productOverrides.map(item => [item.productSlug, item]));

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <div><div className="admin-wordmark">Ghar<span>Chamak</span></div><small>Content Console</small></div>
      <nav><a href="#overview">Overview</a><a href="#offers">Offers</a><a href="#products">Products</a><a href="#partners">Partners</a><a href="#media">Media</a><a href="#reviews">Reviews</a><a href="#settings">Site settings</a></nav>
      <form action={logoutAdmin}><button className="admin-ghost" type="submit">Sign out</button></form>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><p className="admin-kicker">GharChamak CMS</p><h1>Content control</h1><p>Signed in as {session.email}</p></div><Link className="admin-secondary" href="/en" target="_blank">View website <ExternalLink size={15}/></Link></header>
      {query.notice ? <div className="admin-alert success">{query.notice}</div> : null}
      {query.error ? <div className="admin-alert danger">{query.error}</div> : null}
      {!data.databaseReady ? <div className="admin-alert danger"><strong>CMS database not ready.</strong> {data.error} Configure DATABASE_URL in Vercel, then redeploy.</div> : null}

      <section id="overview" className="admin-grid metrics">
        <article><Megaphone/><strong>{data.offers.length}</strong><span>Offers</span></article>
        <article><Store/><strong>{data.partners.length}</strong><span>Partners</span></article>
        <article><ImageIcon/><strong>{data.media.length}</strong><span>Media assets</span></article>
        <article><Quote/><strong>{data.reviews.length}</strong><span>Reviews</span></article>
      </section>

      <fieldset disabled={!data.databaseReady} className="admin-fieldset">
        <section id="offers" className="admin-section">
          <div className="admin-section-head"><div><p className="admin-kicker">Campaigns</p><h2>Offers</h2></div></div>
          <details className="admin-editor" open={data.offers.length === 0}><summary>Add an offer</summary><form action={saveOffer} className="admin-form admin-form-grid">
            <label>Title<input name="title" required /></label><label>Nepali title<input name="titleNe" /></label>
            <label className="wide">Description<textarea name="description" rows={3}/></label><label className="wide">Nepali description<textarea name="descriptionNe" rows={3}/></label>
            <label>Badge<input name="badge" placeholder="Launch offer"/></label><label>Image URL<input name="imageUrl" type="url"/></label>
            <label>CTA label<input name="ctaLabel" placeholder="Learn more"/></label><label>CTA URL<input name="ctaUrl" type="url"/></label>
            <label>Starts<input name="startsAt" type="datetime-local"/></label><label>Ends<input name="endsAt" type="datetime-local"/></label>
            <label>Sort order<input name="sortOrder" type="number" defaultValue="0"/></label><label className="admin-check"><input name="published" type="checkbox"/> Publish now</label>
            <button className="admin-primary wide" type="submit">Save offer</button>
          </form></details>
          <div className="admin-list">{data.offers.length ? data.offers.map(item => <article key={item.id} className="admin-list-card"><div><Status published={item.published}/><h3>{item.title}</h3><p>{item.description || "No description"}</p></div><form action={deleteOffer}><input type="hidden" name="id" value={item.id}/><button className="admin-danger" type="submit">Delete</button></form></article>) : <Empty>No offers yet.</Empty>}</div>
        </section>

        <section id="products" className="admin-section">
          <div className="admin-section-head"><div><p className="admin-kicker">Catalog</p><h2>Product commercial fields</h2></div><p>Only publish MRP, pack size and availability once commercially confirmed.</p></div>
          <div className="admin-product-grid">{products.map(product => { const override = overrideBySlug.get(product.slug); return <form action={saveProductOverride} className="admin-product-card" key={product.slug}>
            <input type="hidden" name="productSlug" value={product.slug}/><Package/><h3>{product.name.en}</h3>
            <label>Status<select name="status" defaultValue={override?.status || product.status}><option value="coming-soon">Coming soon</option><option value="available">Available</option></select></label>
            <label>MRP (NPR)<input name="mrp" inputMode="decimal" defaultValue={override?.mrp || ""}/></label>
            <label>Pack size<input name="packSize" defaultValue={override?.packSize || ""} placeholder="e.g. 500 ml"/></label>
            <label>Public image URL<input name="imageUrl" type="url" defaultValue={override?.imageUrl || ""}/></label>
            <button className="admin-primary" type="submit">Save product</button>
          </form>})}</div>
        </section>

        <section id="partners" className="admin-section">
          <div className="admin-section-head"><div><p className="admin-kicker">Trade network</p><h2>Partners</h2></div></div>
          <details className="admin-editor" open={data.partners.length === 0}><summary>Add a partner</summary><form action={savePartner} className="admin-form admin-form-grid">
            <label>Name<input name="name" required/></label><label>Type<select name="partnerType"><option>Retailer</option><option>Distributor</option><option>Wholesaler</option><option>Institutional</option></select></label>
            <label>Location<input name="location"/></label><label>Logo/photo URL<input name="imageUrl" type="url"/></label>
            <label>Website URL<input name="websiteUrl" type="url"/></label><label>Sort order<input name="sortOrder" type="number" defaultValue="0"/></label>
            <label className="admin-check"><input name="published" type="checkbox"/> Publish now</label><button className="admin-primary" type="submit">Save partner</button>
          </form></details>
          <div className="admin-list">{data.partners.length ? data.partners.map(item => <article key={item.id} className="admin-list-card"><div><Status published={item.published}/><h3>{item.name}</h3><p>{item.partnerType}{item.location ? ` • ${item.location}` : ""}</p></div><form action={deletePartner}><input type="hidden" name="id" value={item.id}/><button className="admin-danger" type="submit">Delete</button></form></article>) : <Empty>No partners yet.</Empty>}</div>
        </section>

        <section id="media" className="admin-section">
          <div className="admin-section-head"><div><p className="admin-kicker">Asset library</p><h2>Media</h2></div><p>Direct uploads are capped at 4 MB. Add larger videos by URL.</p></div>
          <div className="admin-two-col">
            <details className="admin-editor" open><summary><Upload size={16}/> Upload image / short video</summary><form action={uploadMedia} className="admin-form">
              <label>Label<input name="label" required/></label><label>File<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm" required/></label>
              <label>English alt text<input name="altEn"/></label><label>Nepali alt text<input name="altNe"/></label><button className="admin-primary" type="submit">Upload</button>
            </form></details>
            <details className="admin-editor"><summary>Add existing media URL</summary><form action={addMediaUrl} className="admin-form">
              <label>Label<input name="label" required/></label><label>Type<select name="kind"><option value="image">Image</option><option value="video">Video</option></select></label>
              <label>URL<input name="url" type="url" required/></label><label>English alt text<input name="altEn"/></label><label>Nepali alt text<input name="altNe"/></label><button className="admin-primary" type="submit">Add URL</button>
            </form></details>
          </div>
          <div className="admin-media-grid">{data.media.length ? data.media.map(item => <article key={item.id} className="admin-media-card">{item.kind === "image" ? <img src={item.url} alt={item.altEn || item.label}/> : <div className="admin-video-placeholder">VIDEO</div>}<div><strong>{item.label}</strong><input value={item.url} readOnly aria-label={`${item.label} URL`}/><form action={deleteMedia}><input type="hidden" name="id" value={item.id}/><button className="admin-danger" type="submit">Delete record</button></form></div></article>) : <Empty>No media uploaded yet.</Empty>}</div>
        </section>

        <section id="reviews" className="admin-section">
          <div className="admin-section-head"><div><p className="admin-kicker">Social proof</p><h2>Customer reviews</h2></div></div>
          <details className="admin-editor" open={data.reviews.length === 0}><summary>Add a review</summary><form action={saveReview} className="admin-form admin-form-grid">
            <label>Customer name<input name="customerName" required/></label><label>Product<select name="productSlug"><option value="">General</option>{products.map(product => <option key={product.slug} value={product.slug}>{product.name.en}</option>)}</select></label>
            <label className="wide">Review<textarea name="quote" rows={3} required/></label><label className="wide">Nepali review<textarea name="quoteNe" rows={3}/></label>
            <label>Photo/video URL<input name="mediaUrl" type="url"/></label><label className="admin-check"><input name="featured" type="checkbox"/> Featured</label>
            <label className="admin-check"><input name="published" type="checkbox"/> Publish now</label><button className="admin-primary" type="submit">Save review</button>
          </form></details>
          <div className="admin-list">{data.reviews.length ? data.reviews.map(item => <article key={item.id} className="admin-list-card"><div><Status published={item.published}/><h3>{item.customerName}</h3><p>“{item.quote}”</p></div><form action={deleteReview}><input type="hidden" name="id" value={item.id}/><button className="admin-danger" type="submit">Delete</button></form></article>) : <Empty>No reviews yet.</Empty>}</div>
        </section>

        <section id="settings" className="admin-section">
          <div className="admin-section-head"><div><p className="admin-kicker">Website</p><h2>Site settings</h2></div></div>
          <form action={saveSiteSettings} className="admin-form admin-form-grid admin-editor-static">
            <label className="wide">Announcement — English<input name="announcementEn" defaultValue={data.settings.announcement_en || ""} placeholder="GharChamak • Built for everyday Nepali homes"/></label>
            <label className="wide">Announcement — Nepali<input name="announcementNe" defaultValue={data.settings.announcement_ne || ""}/></label>
            <button className="admin-primary wide" type="submit">Save website settings</button>
          </form>
        </section>
      </fieldset>
    </section>
  </main>;
}
