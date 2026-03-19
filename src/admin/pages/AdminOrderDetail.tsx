import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Table, Form, Row, Col, Button } from 'react-bootstrap';
import { getOrder, type AdminOrder, type OrderItem } from '../../api/admin';
import { getFriendlyErrorMessage } from '../../utils/errorMessages';

function parseMoneyToNumber(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'string') {
    const cleaned = v.replace(/[^\d.,-]/g, '').replace(/\s+/g, '');
    if (!cleaned) return 0;
    const normalized = cleaned.includes(',') && !cleaned.includes('.') ? cleaned.replace(',', '.') : cleaned;
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function normalizeStatusToUiOption(status: unknown): string {
  if (!status) return 'En attente';
  const s = String(status).toLowerCase();
  if (s.includes('livr')) return 'Livrée';
  if (s.includes('exp') || s.includes('shipped')) return 'Expédiée';
  if (s.includes('prépa') || s.includes('prepar')) return 'En préparation';
  return 'En attente';
}

function mapApiOrderToOrderDetail(apiOrder: AdminOrder): OrderDetail {
  const items = (apiOrder.items ?? []) as OrderItem[];
  const lignes: OrderLine[] = items.map((it) => {
    const unit = parseMoneyToNumber((it as { unit_price?: string }).unit_price);
    const quantity = Number.isFinite(it.quantity) ? it.quantity : 1;
    return {
      livre: (it.book_title ?? 'Livre') as string,
      ref: (it.format_name ?? it.format ?? '—') as string,
      qte: quantity,
      prixUnitaire: unit,
      total: unit * quantity,
    };
  });

  const total = parseMoneyToNumber(apiOrder.total_amount ?? apiOrder.total);
  const orderDate = apiOrder.order_date ?? apiOrder.created_at ?? '';
  const shippingAddress = apiOrder.shipping_address ?? '—';
  const paymentStatus = apiOrder.payment_status ?? apiOrder.status ?? '—';

  return {
    id: Number(apiOrder.id) || 0,
    numero: `#CMD-${apiOrder.id}`,
    date: orderDate ? new Date(orderDate).toLocaleDateString('fr-FR') : '—',
    statut: normalizeStatusToUiOption(apiOrder.shipping_status ?? apiOrder.payment_status ?? paymentStatus),
    client: { nom: '—', email: '—', tel: '—' },
    adresseLivraison: {
      adresse: shippingAddress,
      complement: '',
      codePostal: '',
      ville: '',
      pays: '',
    },
    facturation: { adresse: shippingAddress, codePostal: '', ville: '' },
    lignes,
    sousTotal: total,
    fraisLivraison: 0,
    remise: 0,
    total,
    modePaiement: paymentStatus,
    note: '',
  };
}

interface OrderLine {
  livre: string;
  ref: string;
  qte: number;
  prixUnitaire: number;
  total: number;
}

interface OrderDetail {
  id: number;
  numero: string;
  date: string;
  statut: string;
  client: { nom: string; email: string; tel: string };
  adresseLivraison: { adresse: string; complement: string; codePostal: string; ville: string; pays: string };
  facturation: { adresse: string; codePostal: string; ville: string };
  lignes: OrderLine[];
  sousTotal: number;
  fraisLivraison: number;
  remise: number;
  total: number;
  modePaiement: string;
  note: string;
}

const mockOrdersDetail: Record<number, OrderDetail> = {
  1001: {
    id: 1001,
    numero: '#CMD-1001',
    date: '08/02/2025',
    statut: 'Expédiée',
    client: { nom: 'Marie Dupont', email: 'marie.dupont@email.fr', tel: '06 12 34 56 78' },
    adresseLivraison: { adresse: '12 rue des Lilas', complement: 'Apt 3', codePostal: '75001', ville: 'Paris', pays: 'France' },
    facturation: { adresse: '12 rue des Lilas', codePostal: '75001', ville: 'Paris' },
    lignes: [
      { livre: 'Think and Grow Rich', ref: 'ISBN-001', qte: 2, prixUnitaire: 55.0, total: 110 },
      { livre: 'Pushing Clouds', ref: 'ISBN-002', qte: 1, prixUnitaire: 45.0, total: 45.0 },
    ],
    sousTotal: 155.0,
    fraisLivraison: 10.0,
    remise: 0,
    total: 165.0,
    modePaiement: 'Carte bancaire',
    note: 'Livrer après 18h si possible.',
  },
  1002: {
    id: 1002,
    numero: '#CMD-1002',
    date: '07/02/2025',
    statut: 'En préparation',
    client: { nom: 'Jean Martin', email: 'jean.martin@email.fr', tel: '06 98 76 54 32' },
    adresseLivraison: { adresse: '5 avenue de la Gare', complement: '', codePostal: '69001', ville: 'Lyon', pays: 'France' },
    facturation: { adresse: '5 avenue de la Gare', codePostal: '69001', ville: 'Lyon' },
    lignes: [
      { livre: 'Terrible Madness', ref: 'ISBN-003', qte: 1, prixUnitaire: 60.0, total: 60 },
      { livre: 'Battle Drive', ref: 'ISBN-004', qte: 2, prixUnitaire: 50.0, total: 100 },
    ],
    sousTotal: 160.0,
    fraisLivraison: 0,
    remise: 0,
    total: 160.0,
    modePaiement: 'PayPal',
    note: '',
  },
  1003: {
    id: 1003,
    numero: '#CMD-1003',
    date: '06/02/2025',
    statut: 'Livrée',
    client: { nom: 'Sophie Bernard', email: 'sophie.bernard@email.fr', tel: '06 11 22 33 44' },
    adresseLivraison: { adresse: '8 place du Marché', complement: '', codePostal: '33000', ville: 'Bordeaux', pays: 'France' },
    facturation: { adresse: '8 place du Marché', codePostal: '33000', ville: 'Bordeaux' },
    lignes: [
      { livre: 'Think and Grow Rich', ref: 'ISBN-001', qte: 1, prixUnitaire: 55.0, total: 55.0 },
      { livre: 'Terrible Madness', ref: 'ISBN-003', qte: 2, prixUnitaire: 60.0, total: 120 },
      { livre: 'Pushing Clouds', ref: 'ISBN-002', qte: 2, prixUnitaire: 45.0, total: 90 },
    ],
    sousTotal: 265.0,
    fraisLivraison: 0,
    remise: 15,
    total: 250.0,
    modePaiement: 'Carte bancaire',
    note: '',
  },
  1004: {
    id: 1004,
    numero: '#CMD-1004',
    date: '05/02/2025',
    statut: 'En attente',
    client: { nom: 'Pierre Leroy', email: 'pierre.leroy@email.fr', tel: '06 55 66 77 88' },
    adresseLivraison: { adresse: '22 boulevard Victor Hugo', complement: 'Bât B', codePostal: '31000', ville: 'Toulouse', pays: 'France' },
    facturation: { adresse: '22 boulevard Victor Hugo', codePostal: '31000', ville: 'Toulouse' },
    lignes: [
      { livre: 'Battle Drive', ref: 'ISBN-004', qte: 1, prixUnitaire: 65.0, total: 65.0 },
    ],
    sousTotal: 65.0,
    fraisLivraison: 10.0,
    remise: 0,
    total: 75.0,
    modePaiement: 'PayPal',
    note: 'Merci.',
  },
};

const statutOptions = ['En attente', 'En préparation', 'Expédiée', 'Livrée'];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statut, setStatut] = useState('En attente');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setError('Commande introuvable.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const apiOrder = await getOrder(id);
        if (cancelled) return;
        const mapped = mapApiOrderToOrderDetail(apiOrder);
        setOrder(mapped);
        setStatut(mapped.statut);
      } catch (err) {
        if (cancelled) return;
        const fallback = mockOrdersDetail[Number(id)];
        if (fallback) {
          setOrder(fallback);
          setStatut(fallback.statut);
        } else {
          setError(getFriendlyErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-content bg-grey">
        <div className="container py-5 text-center">Chargement de la commande…</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="admin-card">
        <p>{error || 'Commande introuvable.'}</p>
        <Link to="/admin/commandes">Retour à la liste</Link>
      </div>
    );
  }

  const { client, adresseLivraison, facturation, lignes } = order;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="admin-page-title mb-0">Commande {order.numero}</h1>
        <Link to="/admin/commandes" className="btn btn-outline-secondary btnhover">
          <i className="fa fa-arrow-left me-1"></i> Retour aux commandes
        </Link>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="admin-card mb-3">
            <Card.Body>
              <h5 className="admin-card-title">Articles</h5>
              <Table className="admin-table mb-0">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Réf.</th>
                    <th className="text-center">Qté</th>
                    <th className="text-end">Prix unitaire</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l, i) => (
                    <tr key={i}>
                      <td>{l.livre}</td>
                      <td>{l.ref}</td>
                      <td className="text-center">{l.qte}</td>
                      <td className="text-end">{l.prixUnitaire.toFixed(2)} $</td>
                      <td className="text-end">{l.total.toFixed(2)} $</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="admin-card mb-3">
            <Card.Body>
              <h5 className="admin-card-title">Résumé</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total</span>
                <span>{order.sousTotal.toFixed(2)} $</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Livraison</span>
                <span>{(order.fraisLivraison || 0).toFixed(2)} $</span>
              </div>
              {order.remise > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Remise</span>
                  <span>-{order.remise.toFixed(2)} $</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>{order.total.toFixed(2)} $</span>
              </div>
              <p className="text-muted small mb-0 mt-2">{order.modePaiement}</p>
            </Card.Body>
          </Card>

          <Card className="admin-card mb-3">
            <Card.Body>
              <h5 className="admin-card-title">Statut</h5>
              <Form.Select value={statut} onChange={(e) => setStatut(e.target.value)}>
                {statutOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
              <Button size="sm" className="btn-primary btnhover mt-2">Enregistrer le statut</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="admin-card">
            <Card.Body>
              <h5 className="admin-card-title">Client</h5>
              <p className="mb-1"><strong>{client.nom}</strong></p>
              <p className="mb-1 small"><a href={`mailto:${client.email}`}>{client.email}</a></p>
              <p className="mb-0 small">{client.tel}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="admin-card">
            <Card.Body>
              <h5 className="admin-card-title">Adresse de livraison</h5>
              <p className="mb-1">{adresseLivraison.adresse}</p>
              {adresseLivraison.complement && <p className="mb-1">{adresseLivraison.complement}</p>}
              <p className="mb-0">{adresseLivraison.codePostal} {adresseLivraison.ville}</p>
              <p className="mb-0 small text-muted">{adresseLivraison.pays}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="admin-card">
            <Card.Body>
              <h5 className="admin-card-title">Adresse de facturation</h5>
              <p className="mb-1">{facturation.adresse}</p>
              <p className="mb-0">{facturation.codePostal} {facturation.ville}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {order.note && (
        <Card className="admin-card mt-3">
          <Card.Body>
            <h5 className="admin-card-title">Note client</h5>
            <p className="mb-0">{order.note}</p>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
