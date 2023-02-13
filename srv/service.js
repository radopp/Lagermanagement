const cds = require('@sap/cds')
module.exports = function () {
    const {Bestellung_Produkt, Bestellungen} = cds.entities ('at.clouddna.lagermanagement')

    this.on("produkteBestellen", async (request) => {
        const { bestelldatum, lieferdatum, produkte } = request.data;

        const createdBestellung = await INSERT ({
            bestelldatum: bestelldatum,
            lieferdatum: lieferdatum
        }) .into (Bestellungen);

        const bestellpositionen = produkte.map((produkt) => {
            return {
                produkt_ID: produkt.produkt_ID,
                bestellung_ID: createdBestellung.req.data.ID,
                anzahl: produkt.anzahl
            }
        });

        const createdBestellpos = await INSERT (bestellpositionen) .into (Bestellung_Produkt);

    })

}