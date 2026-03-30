import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  discountPrice?: string;
  discount?: string;
  icon: LucideIcon;
  href: string;
  gradient?: string;
  index: number;
}

const ServiceCard = ({
  title,
  description,
  price,
  discountPrice,
  discount,
  icon: Icon,
  href,
  index,
}: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
    >
      <Link to={href} className="block group">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card hover:border-primary/40 transition-all duration-300 hover:shadow-glow h-full flex flex-col">
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="font-display font-semibold text-lg text-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 flex-1">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {discountPrice ? (
                <>
                  <span className="text-sm text-muted-foreground line-through">{price}</span>
                  <span className="font-display font-semibold text-primary">{discountPrice}</span>
                  {discount && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {discount}
                    </span>
                  )}
                </>
              ) : (
                <span className="font-display font-semibold text-foreground">{price}</span>
              )}
            </div>
            <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn More <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
