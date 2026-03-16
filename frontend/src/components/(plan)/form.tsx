"use client";

import axios from "axios";
import { CheckIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

export const PlanForm = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billing, setBilling] = useState("monthly");
  const [locations, setLocations] = useState(5);
  const [selectedFeatues, setSelectedFeatures] = useState({
    monthly: [],
    quaterly: [],
    yearly: [],
  });

  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    (async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/plans`,
      );

      setIsLoading(false);
      setSelectedFeatures({
        monthly: ["REVIEW", "CAMPAIGN", "POST", "REPORT", "AI"],
        quaterly: ["REVIEW", "CAMPAIGN", "POST", "REPORT", "AI"],
        yearly: ["REVIEW", "CAMPAIGN", "POST", "REPORT", "AI"],
      });

      console.log("response", response);
      setData(response.data.data);
    })();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const togglePlan = (feature, pricingKey) => {
    const selectedPricingFeature = selectedFeatues[pricingKey];

    const isPresent = selectedPricingFeature.includes(feature);

    if (isPresent) {
      const filteredFeatures = selectedPricingFeature.filter(
        (selectedFeature) => selectedFeature !== feature,
      );

      setSelectedFeatures((prevFeatures) => ({
        ...prevFeatures,
        [pricingKey]: filteredFeatures,
      }));
    } else {
      setSelectedFeatures((prevFeatures) => ({
        ...prevFeatures,
        [pricingKey]: [...prevFeatures[pricingKey], feature],
      }));
    }
  };

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      return;
    }

    try {
      const body = {
        billing,
        locations,
        features: selectedFeatues[billing],
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/create-order`,
        body,
      );

      console.log("response", response);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        currency: response.data.data.currency,
        order_id: response.data.data.id,
        name: "Notekar",
        description: "Subscription Payment",

        handler: async (response) => {
          const verifyRes = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/verify-payment`,
            response,
          );

          if (verifyRes.data.success) {
            alert("Payment successful");
          } else {
            alert("Payment verification failed");
          }
        },
      };

      console.log("options", options);

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.log("Payment failed", response.error);
        alert("Payment failed");
      });

      paymentObject.open();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-10">
        <p>Locations</p>
        <div className="flex items-center gap-3">
          <button
            disabled={locations <= 1}
            onClick={() => {
              setLocations((prevState) => prevState - 1);
            }}
            className="size-8 rounded-md border border-neutral-300 flex items-center justify-center disabled:cursor-not-allowed"
          >
            <MinusIcon size={18} />
          </button>
          <p className="text-sm font-semibold">{locations}</p>
          <button
            disabled={locations >= 10}
            onClick={() => setLocations((prevState) => prevState + 1)}
            className="size-8 rounded-md border border-neutral-300 flex items-center justify-center disabled:cursor-not-allowed"
          >
            <PlusIcon size={18} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4 p-1.5">
        {["monthly", "quaterly", "yearly"].map((plan) => {
          const isSelected = billing === plan;

          return (
            <div
              key={plan}
              onClick={() => setBilling(plan)}
              className={`h-10 text-sm font-medium px-3 py-2 rounded-md border ${isSelected ? "bg-blue-500 text-white border-blue-700" : "bg-white border-neutral-300"}`}
            >
              {plan.toUpperCase()}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-10">
        <div className="flex flex-col">
          {data?.map((feature) => {
            return <p key={feature._id}>{feature.feature}</p>;
          })}
        </div>
        <div className="flex flex-col">
          {data?.map((feature) => {
            // const prices = Object.values(feature.pricing);
            const pricingKeys = Object.keys(feature.pricing);

            return (
              <div
                key={feature._id}
                className="col-span-3 grid grid-cols-3 gap-4"
              >
                {pricingKeys.map((pricingKey, idx) => {
                  const isFree = feature.pricing[pricingKey] === 0;

                  const planSelectedFeatures = selectedFeatues[
                    pricingKey
                  ].includes(feature.featureKey);

                  if (isFree) {
                    return (
                      <p key={`${feature._id}-${pricingKey}-${idx}`}>Free</p>
                    );
                  }

                  return (
                    <div
                      key={`${feature._id}-${pricingKey}-${idx}`}
                      onClick={() => togglePlan(feature.featureKey, pricingKey)}
                      className="size-6 rounded-md border border-neutral-300 flex items-center justify-center"
                    >
                      {planSelectedFeatures && <CheckIcon size={18} />}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <button
        disabled={!isRazorpayLoaded}
        onClick={handlePayment}
        className="min-w-sm h-10 px-3 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Pay now
      </button>
    </div>
  );
};
