"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useMotionTemplate, Variants } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";

const NOISE_PATTERN = 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")';

export type TierType = {
  name: string;
  priceMonthly: string;
  priceSemiAnnual: string;
  priceAnnual: string;
  description: string;
  isPopular?: boolean;
  /** Тёмная карточка с золотой рамкой (премиум-тариф без цены). */
  isExclusive?: boolean;
  features: string[];
  /** Явно НЕ включённые пункты — рендерятся с крестиком и приглушённо. */
  excludedFeatures?: string[];
  /** Если задано — вместо цены/валюты/«/мес» показывается эта подпись
   *  (например, «После аудита» для тарифа без фиксированной цены). */
  priceLabel?: string;
  /** Индивидуальная подпись CTA-кнопки (иначе — общий ctaLabel). */
  ctaLabel?: string;
  /** Отключает подпись о демо-периоде под CTA (для тарифов без пробного доступа). */
  noTrial?: boolean;
};

type BillingPeriod = "monthly" | "semi" | "annual";

export interface PricingGlassProps {
  title?: string;
  description?: string;
  tiers: TierType[];
  className?: string;
  /** Текст CTA-кнопки на карточке. */
  ctaLabel?: string;
  /** Символ валюты перед ценой (по умолчанию $). */
  currency?: string;
  /** Бейдж о бесплатном демо-периоде в шапке блока. */
  trialBadge?: string;
  /** Подпись о демо-периоде под CTA-кнопкой тарифа. */
  trialNote?: string;
  /** Вызывается при клике по CTA тарифа. */
  onGetStarted?: (tier: TierType) => void;
}

function PricingCard({
  tier,
  period,
  ctaLabel,
  currency,
  trialNote,
  onGetStarted,
}: {
  tier: TierType;
  period: BillingPeriod;
  ctaLabel: string;
  currency: string;
  trialNote?: string;
  onGetStarted?: (tier: TierType) => void;
}) {
  const price =
    period === "monthly"
      ? tier.priceMonthly
      : period === "semi"
        ? tier.priceSemiAnnual
        : tier.priceAnnual;

  // Экономия за выбранный период (в валюте), относительно помесячной оплаты.
  const monthlyNum = parseFloat(tier.priceMonthly) || 0;
  const currentNum = parseFloat(price) || 0;
  const months = period === "semi" ? 6 : period === "annual" ? 12 : 1;
  const savings = Math.round((monthlyNum - currentNum) * months);
  const savingsLabel = period === "semi" ? "за полгода" : "в год";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const legoVariant: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring", stiffness: 300, damping: 24,
            staggerChildren: 0.1,
            delayChildren: 0.15
          }
        }
      }}
      onMouseMove={handleMouseMove}
      className={`group relative w-full overflow-hidden rounded-[32px] backdrop-blur-3xl backdrop-saturate-200 backdrop-brightness-110 flex flex-col transition-all duration-500 ${
        tier.isExclusive
        ? "bg-gradient-to-b from-[#17120a]/95 to-[#0b0b0b]/92 border border-amber-400/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.7),0_0_60px_rgba(212,175,55,0.14),inset_0_1px_1px_rgba(255,214,140,0.3)]"
        : tier.isPopular
        ? "bg-white/1 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(255,255,255,0.05),0_32px_64px_-12px_rgba(0,0,0,0.6),0_0_80px_rgba(255,255,255,0.05)] 2xl:-translate-y-4"
        : "bg-white/1 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_32px_64px_-12px_rgba(0,0,0,0.6)]"
      }`}
    >
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none rounded-[32px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent)`
        }}
      />

      {tier.isPopular && (
        <div
          className="absolute inset-0 z-0 rounded-[32px] pointer-events-none p-px"
          style={{
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        >
          <div
            className="absolute -inset-full animate-[spin_4s_linear_infinite]"
            style={{ background: "conic-gradient(from 0deg, transparent 70%, rgba(255,255,255,0.8) 100%)" }}
          />
        </div>
      )}

      {tier.isExclusive && (
        <div
          className="absolute inset-0 z-0 rounded-[32px] pointer-events-none p-px"
          style={{
            background:
              "linear-gradient(140deg, rgba(245,215,130,0.95), rgba(150,110,40,0.25) 45%, rgba(245,215,130,0.85))",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}

      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: NOISE_PATTERN }} />

      {tier.isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 backdrop-blur-md border-b border-x border-white/10 rounded-b-xl text-xs font-medium text-white/90 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          Популярный
        </div>
      )}

      {tier.isExclusive && (
        <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2 px-4 py-1 bg-amber-400/15 backdrop-blur-md border-b border-x border-amber-400/30 rounded-b-xl text-xs font-semibold tracking-wide text-amber-200 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          Эксклюзив
        </div>
      )}

      <div className="relative z-10 flex flex-col p-8 md:p-10 flex-1 pointer-events-none">
        <motion.h3
          variants={legoVariant}
          className={`text-xl font-semibold tracking-wide ${tier.isExclusive ? "text-amber-100/90" : "text-white/80"}`}
        >
          {tier.name}
        </motion.h3>

        <motion.div variants={legoVariant} className="flex items-baseline gap-1 mt-4 mb-2">
          {tier.priceLabel ? (
            <div className="h-[60px] flex items-center">
              <span
                className={`block text-[34px] md:text-[38px] font-bold tracking-tight leading-none ${
                  tier.isExclusive ? "text-amber-200" : "text-white"
                }`}
              >
                {tier.priceLabel}
              </span>
            </div>
          ) : (
            <>
              <span className="text-white/40 text-2xl font-medium tracking-tight">{currency}</span>
              <div className="h-[60px] overflow-hidden flex items-center">
                <span
                  key={price}
                  className="block text-[60px] font-bold text-white tracking-tighter leading-none [animation:priceIn_0.4s_cubic-bezier(0.16,1,0.3,1)]"
                >
                  {price}
                </span>
              </div>
              <span className="text-white/40 text-lg font-medium ml-1">/мес</span>
            </>
          )}
        </motion.div>

        {/* Экономия за выбранный период — резервируем высоту, чтобы не прыгал layout */}
        <div className="mb-3 h-7">
          {!tier.priceLabel && savings > 0 && (
            <span
              key={`${period}-${savings}`}
              className="inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/20 [animation:priceIn_0.35s_ease]"
            >
              Экономия {currency}
              {savings} {savingsLabel}
            </span>
          )}
        </div>

        <motion.p variants={legoVariant} className="text-white/40 text-sm leading-relaxed mb-8 min-h-[40px]">
          {tier.description}
        </motion.p>

        <motion.div variants={legoVariant} className={`w-full h-px mb-8 ${tier.isExclusive ? "bg-amber-400/20" : "bg-white/10"}`} />

        <div className="flex flex-col gap-4 mb-10 flex-1">
          {tier.features.map((feat: string, i: number) => (
            <motion.div key={i} variants={legoVariant} className="flex items-start gap-3">
              <div className={`shrink-0 flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${
                tier.isExclusive ? "bg-amber-400/15 border-amber-400/30" : "bg-white/10 border-white/10"
              }`}>
                <Check className={`w-3 h-3 ${tier.isExclusive ? "text-amber-300" : "text-white/90"}`} strokeWidth={3} />
              </div>
              <span className="text-white/70 font-medium text-[14px] leading-tight">{feat}</span>
            </motion.div>
          ))}
          {tier.excludedFeatures?.map((feat: string, i: number) => (
            <motion.div key={`x-${i}`} variants={legoVariant} className="flex items-start gap-3">
              <div className="shrink-0 flex items-center justify-center w-5 h-5 mt-0.5 rounded-full border border-white/10 bg-white/5">
                <X className="w-3 h-3 text-white/40" strokeWidth={3} />
              </div>
              <span className="text-white/40 font-medium text-[14px] leading-tight">{feat}</span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={legoVariant} className="pointer-events-auto">
          <button
            onClick={() => onGetStarted?.(tier)}
            className={`w-full py-4 rounded-[16px] font-semibold text-[15px] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] ${
            tier.isExclusive
            ? "bg-gradient-to-r from-amber-300 to-amber-500 text-black hover:from-amber-200 hover:to-amber-400 hover:scale-[1.02]"
            : tier.isPopular
            ? "bg-white text-black hover:bg-white/90 hover:scale-[1.02]"
            : "bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:scale-[1.02]"
          }`}>
            {tier.ctaLabel ?? ctaLabel}
          </button>
          {trialNote && !tier.noTrial && (
            <p className="mt-3 text-center text-xs font-medium text-white/40">{trialNote}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function PricingGlass({
  title = "Простые и прозрачные тарифы.",
  description = "Выберите подходящий план. При годовой оплате — выгоднее до 20%.",
  tiers,
  className,
  ctaLabel = "Начать",
  currency = "$",
  trialBadge,
  trialNote,
  onGetStarted,
}: PricingGlassProps) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const isDiscounted = period !== "monthly";

  const legoVariant: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } }
      }}
      className={`w-full flex flex-col items-center justify-center p-4 gap-16 relative ${className || ""}`}
    >

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none z-0"
        animate={{ scale: isDiscounted ? 1.05 : 1, opacity: isDiscounted ? 0.08 : 0.05 }}
        transition={{ duration: 1 }}
      />

      <div className="flex flex-col items-center gap-8 relative z-20 w-full">
        <div className="text-center space-y-4 px-4">
          <motion.h2 variants={legoVariant} className="text-4xl md:text-5xl font-bold text-white tracking-tight">{title}</motion.h2>
          <motion.p variants={legoVariant} className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
            {description}
          </motion.p>
          {trialBadge && (
            <motion.div variants={legoVariant} className="flex justify-center pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-md">
                <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                {trialBadge}
              </span>
            </motion.div>
          )}
        </div>

        <motion.div variants={legoVariant} className="relative flex w-full max-w-md items-center rounded-full border border-white/10 bg-white/5 p-1.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] backdrop-blur-3xl">
          {/* Скользящий индикатор — треть ширины */}
          <motion.div
            className="absolute left-1.5 top-1.5 bottom-1.5 w-[calc((100%-0.75rem)/3)] rounded-full border border-white/20 bg-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            animate={{ x: period === "monthly" ? "0%" : period === "semi" ? "100%" : "200%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <button
            onClick={() => setPeriod("monthly")}
            className={`relative z-10 flex-1 whitespace-nowrap rounded-full px-2 py-3 text-xs font-semibold transition-colors duration-300 sm:px-4 sm:text-sm ${period === "monthly" ? "text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Помесячно
          </button>
          <button
            onClick={() => setPeriod("semi")}
            className={`relative z-10 inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 py-3 text-xs font-semibold transition-colors duration-300 sm:px-4 sm:text-sm ${period === "semi" ? "text-white" : "text-white/50 hover:text-white/80"}`}
          >
            За полгода
            <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-black">−15%</span>
          </button>
          <button
            onClick={() => setPeriod("annual")}
            className={`relative z-10 inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-2 py-3 text-xs font-semibold transition-colors duration-300 sm:px-4 sm:text-sm ${period === "annual" ? "text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Ежегодно
            <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-black">−30%</span>
          </button>
        </motion.div>
      </div>

      <div className="relative w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 lg:gap-8 items-stretch z-20">
        {tiers.map((tier) => (
          <PricingCard key={tier.name} tier={tier} period={period} ctaLabel={ctaLabel} currency={currency} trialNote={trialNote} onGetStarted={onGetStarted} />
        ))}
      </div>

    </motion.div>
  );
}
