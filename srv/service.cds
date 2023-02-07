using at.clouddna.lagermanagement as lm from '../db/schema';

service Lagermanagement {
    entity Produkte as projection on lm.Produkte;
    entity Lager as projection on lm.Lager;
    entity Lagerbestand as projection on lm.Lager_Produkte;
    entity Bestellungen as projection on lm.Bestellungen;
    entity Bestellposition as projection on lm.Bestellung_Produkt;
    entity Lieferanten as projection on lm.Lieferanten;
}