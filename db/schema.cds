namespace at.clouddna.lagermanagement;

using {
    cuid
} from '@sap/cds/common';

entity Lager : cuid {
    name : String;
    ort : String;
};

entity Produkte : cuid {
    name : String;
    beschreibung: String;
    preis: Decimal;
    mindestbestand : Decimal;
    mengeok : Decimal;
    mengewarnung : Decimal;
    lieferant : Association to one Lieferanten;
}

entity Lieferanten : cuid {
    name : String;
}

entity Bestellungen : cuid {
    bestelldatum : Date;
    lieferdatum : Date;
    positionen: Association to many Bestellung_Produkt on positionen.bestellung=$self;
}

entity Bestellung_Produkt {
    key bestellung : Association to one Bestellungen;
    key produkt : Association to one Produkte;
    anzahl : Decimal;
}

entity Lager_Produkte {
    key lager : Association to one Lager;
    key produkt : Association to one Produkte;
    menge : Decimal;
}
