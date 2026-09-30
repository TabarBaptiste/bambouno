"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { formatPrice, menuIndex } from "@/data/menu";
import { useOrder } from "@/components/OrderProvider";
import { NewTabHint } from "@/components/NewTabHint";
import { cleanName, MAX_NAME_LENGTH, orderName, sortByMenu, whatsappUrl } from "@/lib/order";
import { WhatsAppIcon } from "@/components/icons";

/** Quand plus rien ne peut garder le focus (panier vidé), il revient à la carte. */
function focusMenu() {
  document.getElementById("carte")?.focus();
}

/**
 * Barre basse « Voir le panier », puis panneau du panier. Commander se fait
 * en deux temps volontairement : on vérifie sa sélection et on donne son
 * prénom avant d'ouvrir WhatsApp, jamais par un clic accidentel.
 *
 * Le panneau est un <dialog> natif ouvert en modal : piège du focus, touche
 * Échap et fond inerte sont gérés par le navigateur.
 */
export function OrderBar() {
  const { count, total } = useOrder();
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  const articles = count > 1 ? "articles" : "article";

  return (
    <>
      {count > 0 ? (
        <>
          {/*
            Cale de la hauteur de la barre : réservée seulement quand la barre
            existe, pour ne pas laisser de vide sous le pied de page à vide.
          */}
          <div aria-hidden className="h-24" />
          <div
            id="order-bar"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
          >
            <div className="mx-auto max-w-3xl px-4 py-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-red-cta px-4 text-left text-white transition-colors hover:bg-red-dark"
              >
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white font-heading font-semibold text-ink"
                >
                  {count}
                </span>
                <span className="flex-1 font-heading text-lg font-semibold uppercase tracking-wide">
                  Voir le panier
                  <span className="sr-only">
                    , {count} {articles}
                  </span>
                </span>
                <span className="font-heading text-lg font-semibold">
                  <span className="sr-only">total </span>
                  {formatPrice(total)}
                </span>
              </button>
            </div>
          </div>
        </>
      ) : null}

      {/*
        Le clic sur le fond n'est qu'un raccourci souris : au clavier, Échap
        (natif au <dialog>) et le bouton « Fermer » font la même chose.
      */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialog}
        aria-labelledby="panier-titre"
        onClose={() => {
          setOpen(false);
          if (count === 0) focusMenu();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="m-0 mt-auto max-h-[90dvh] w-full max-w-none overflow-y-auto rounded-t-2xl border border-hairline bg-ink p-0 text-white backdrop:bg-black/70 sm:m-auto sm:max-w-lg sm:rounded-2xl"
      >
        {open ? <CartPanel onClose={() => setOpen(false)} /> : null}
      </dialog>
    </>
  );
}

function CartPanel({ onClose }: { onClose: () => void }) {
  const { lines, count, total, add, remove, clear, name, setName } = useOrder();
  const [error, setError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const nameId = useId();
  const errorId = useId();

  const removeOne = (id: string, quantity: number) => {
    remove(id);
    // La ligne disparaît avec sa dernière unité : le focus revient au titre.
    if (quantity === 1) heading.current?.focus();
  };

  const order = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cleanName(name)) {
      setError(true);
      nameInput.current?.focus();
      return;
    }
    const url = whatsappUrl(lines, name);
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    // Fenêtre bloquée (certains navigateurs intégrés) : on part dans l'onglet.
    else window.location.href = url;
    onClose();
  };

  return (
    <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="panier-titre"
          ref={heading}
          tabIndex={-1}
          className="section-title text-3xl outline-none"
        >
          Votre panier
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le panier"
          className="flex size-11 items-center justify-center rounded-full border border-control text-2xl leading-none hover:border-red"
        >
          <span aria-hidden>×</span>
        </button>
      </div>

      {count === 0 ? (
        <div className="py-10 text-center">
          <p className="text-muted">Votre panier est vide.</p>
          <button type="button" onClick={onClose} className="btn-ghost mt-6 text-sm">
            Voir la carte
          </button>
        </div>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
            {sortByMenu(lines).map((line) => {
              const item = menuIndex[line.id];
              if (!item) return null;
              return (
                <li key={line.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-semibold uppercase leading-tight">
                      {orderName(line.id)}
                    </p>
                    <p className="text-sm text-muted">
                      {formatPrice(item.price * line.quantity)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOne(line.id, line.quantity)}
                    aria-label={`Retirer ${orderName(line.id)}`}
                    className="flex size-11 items-center justify-center rounded-full border border-control text-xl leading-none hover:border-red hover:text-red-text"
                  >
                    <span aria-hidden>−</span>
                  </button>
                  <span className="min-w-5 text-center font-heading text-lg font-semibold">
                    <span className="sr-only">Quantité : </span>
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => add(line.id)}
                    aria-label={`Ajouter ${orderName(line.id)}`}
                    className="flex size-11 items-center justify-center rounded-full bg-red-cta text-xl leading-none text-white hover:bg-red-dark"
                  >
                    <span aria-hidden>+</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                clear();
                heading.current?.focus();
              }}
              className="min-h-10 text-sm text-muted underline underline-offset-4 hover:text-white"
            >
              Vider le panier
            </button>
            <p className="font-heading text-xl font-semibold">
              Total <span className="text-red-text">{formatPrice(total)}</span>
            </p>
          </div>

          <form onSubmit={order} noValidate className="mt-6">
            <label htmlFor={nameId} className="block font-heading text-base font-semibold uppercase">
              Votre prénom
            </label>
            <input
              ref={nameInput}
              id={nameId}
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(false);
              }}
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint="send"
              maxLength={MAX_NAME_LENGTH}
              required
              aria-invalid={error || undefined}
              aria-describedby={error ? errorId : undefined}
              className="mt-2 w-full rounded-full border border-control bg-surface px-4 py-3 text-base text-white aria-invalid:border-red-text"
            />
            {error ? (
              <p id={errorId} className="mt-2 text-sm text-red-text">
                Indiquez votre prénom : on vous appelle avec au moment du retrait.
              </p>
            ) : null}

            <button type="submit" className="btn-primary mt-5 w-full text-base">
              <WhatsAppIcon className="size-5" />
              Commander sur WhatsApp
              <NewTabHint />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
