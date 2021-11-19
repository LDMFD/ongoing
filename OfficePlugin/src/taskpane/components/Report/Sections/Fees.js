/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */

import * as React from "react";

class FeesIntro extends React.Component {
    render() {
        return (
            <div>
                <h2>{this.props.ix}. Fees</h2>
                <p>
                    Any Pension, ISA and Investment (or General Investment Account) funds
                    which are the subject of our ongoing advice will incur fees from several parties:
                </p>
            </div>
        );
    }
}

class StandardFee extends React.Component {
    render() {
        const clientFee = this.props.client.Integral_Advice_fee;
        const StandardFee = 0.75;

        return (
            <div>
                The standard Integral Advice Ongoing Service Fee is <b>{StandardFee}%</b> per year.
                {clientFee != StandardFee &&
                    <> {/* space */}
                        In your case, we have agreed an ongoing fee of <b>{clientFee}%</b> {/* space */}
                        per year, in recognition of our historical agreement.
                    </>
                } {/* space */}
                If any additional fees to cover specific advised events have been incurred,
                these are detailed in the table beneath this list.
            </div>
        );
    }
}

class ProvidersFees extends React.Component {
    render() {
        let { providers, client } = this.props;

        const AvivaName = "Aviva Wrap";
        const multipleProviders = providers.length > 1;

        return (
            <div>
                {multipleProviders &&
                    <p>
                        You have funds on more than one investment platform:
                    </p>
                }
                <div>
                    {providers.map((provider, ix) => {
                        const isAviva = provider.Provider_name == AvivaName
                            && client.Aviva_discounted_fee != "";

                        return isAviva ?
                            <div key={ix}>
                                - You have holdings on the Aviva platform, where we obtained a special pricing deal
                                of {client.Aviva_discounted_fee}% per year.
                            </div>
                            :
                            <div key={ix}>
                                <div dangerouslySetInnerHTML={{ __html: provider.Platform_pricing_structure }} />
                            </div>;
                    })}
                </div>
            </div>
        );
    }
}

class InvestmentFundFees extends React.Component {
    render() {
        const PassiveFee = "0.1";
        const ActiveFee = "0.8";

        let { portfolios } = this.props;

        return (
            <div>
                Investment fund fees.
                Each of the underlying funds that you are invested in charges a percentage per year.
                Passively managed funds can charge as little as {PassiveFee}%.
                Actively managed funds typically charge around {ActiveFee}% per year but can charge more.
            
                <br />
                {portfolios.map((p, ix) => (
                    <div key={ix}>
                        - The current average weighted charge of the funds in
                        your {p.Portfolio_name} portfolio comes to <b>{p.WeightedOCF}</b> per year.
    
                        There are also transactional costs of {p.Transactional_Costs} per year
                        {p.Incidental_Costs && /* TODO needs testing */ <>
                            , and other incidental costs of {p.Incidental_Costs}, per year.
                        </>}
                    </div>
                ))}
            </div>
        );
    }
}

class ModelPortfolioFee extends React.Component {
    render() {
        let { services } = this.props;
        return (
            <div>
                <b>Model Portfolio Service fee</b>
                <br />
                In your case, we have appointed {/* space */}
                {services.length == 1 ?
                    <>
                        {services.entries().next().value}
                        to manage the asset allocation and fund choice within your investments. 
                    </>
                    :
                    <>
                        more than one Model Portfolio Service provider
                        to manage the asset allocation and fund choice within your investments:

                        <div>
                            {Array.from(services.values()).map((m, ix) => (   
                                <span key={ix}>
                                    - {m.MPS_name} charge {m.MPS_charge}% per year.<br />
                                </span>
                            ))}
                        </div>
                    </>
                }
            </div>
        );
    }
}

export class Fees extends React.Component {
    render() {
        const {
            client,
            providers,
            portfolios,
            services,
        } = this.props.db;


        return (
            <>
                <FeesIntro ix={this.props.ix} />

                <StandardFee client={client} />

                <ProvidersFees providers={providers} client={client} />
                
                <InvestmentFundFees portfolios={portfolios} />

                <ModelPortfolioFee services={services} />
            </>
        );
    }
}
