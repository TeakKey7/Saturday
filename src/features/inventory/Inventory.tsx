import { useState } from 'react'
import { StatusBadge } from '@/components/common/Badges'
import assetCategories from '@/data/static/asset-categories.json'
import type { Asset } from '@/types/domain'
import { AssetFormModal } from './AssetFormModal'
import styles from './Inventory.module.css'

export function Inventory({ assets, homeId }: { assets: Asset[]; homeId: string }) {
  const [selected, setSelected] = useState<Asset | null>(null)
  const [formAsset, setFormAsset] = useState<Asset | null | undefined>(undefined)
  const categories = assetCategories.filter(category =>
    assets.some(asset => asset.category === category),
  )

  return (
    <section>
      <div className={styles.toolbar}>
        <div>
          <p className={styles.summary}>{assets.length} assets across {categories.length} categories</p>
        </div>
        <button className={styles.addButton} onClick={() => setFormAsset(null)}>
          <span aria-hidden="true">+</span>
          Add asset
        </button>
      </div>

      <div className={styles.inventory}>
        <div className={styles.catalog}>
        {categories.map(category => (
          <section key={category}>
            <h2 className={styles.category}>{category}</h2>
            <div className={styles.grid}>
              {assets.filter(asset => asset.category === category).map(asset => (
                <button
                  key={asset.id}
                  onClick={() => setSelected(asset === selected ? null : asset)}
                  className={`${styles.asset} ${selected?.id === asset.id ? styles.selected : ''}`}
                >
                  <div className={styles.assetHeader}>
                    <p className={styles.assetName}>{asset.name}</p>
                    <StatusBadge status={asset.status} />
                  </div>
                  <p className={styles.meta}>{asset.brand} · {asset.model}</p>
                  <p className={styles.service}>
                    Next service: <strong>{asset.nextService}</strong>
                  </p>
                </button>
              ))}
            </div>
          </section>
        ))}
        </div>

        {selected && (
          <aside className={styles.details}>
          <div className={styles.detailsHeader}>
            <h2 className={styles.detailsTitle}>Details</h2>
            <button
              aria-label="Close asset details"
              onClick={() => setSelected(null)}
              className={styles.close}
            >
              ×
            </button>
          </div>
          <StatusBadge status={selected.status} />
          <h3 className={styles.selectedName}>{selected.name}</h3>
          <p className={styles.selectedModel}>{selected.brand} · {selected.model}</p>
          <button className={styles.editButton} onClick={() => setFormAsset(selected)}>
            Edit asset
          </button>

          <dl className={styles.definitionList}>
            {[
              { label: 'Category', value: selected.category },
              { label: 'Installed', value: selected.installed },
              { label: 'Last Serviced', value: selected.lastService },
              { label: 'Next Service', value: selected.nextService },
            ].map(row => (
              <div key={row.label} className={styles.definition}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          {selected.notes && (
            <div className={styles.notes}>
              <p className={styles.notesLabel}>Notes</p>
              <p className={styles.notesText}>{selected.notes}</p>
            </div>
          )}
          </aside>
        )}
      </div>

      {formAsset !== undefined && (
        <AssetFormModal
          asset={formAsset}
          homeId={homeId}
          onClose={() => setFormAsset(undefined)}
          onSaved={() => setSelected(null)}
        />
      )}
    </section>
  )
}
