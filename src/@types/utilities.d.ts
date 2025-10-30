interface JwtPayloadBase {
  iat: number;
  exp?: number;
}

interface payloadType extends JwtPayloadBase {
    email: string
    phone: number
    userId: string
    verified: boolean
}

// interface ResetPayload extends JwtPayloadBase {
//    email: string;
//    userId: string;
// }

// type BLOCKCHAIN_NETWORKS_TYPES = 'BTC' | 'ETH' | 'SOL' | 'BNB'| 'LTC'| 'XRP'| 'XLM' | 'TRC' | 'DOGE' | 'POLYGON' | 'LUNC' | 'USDT' | 'USDC' | 'SHIBA' | 'PEPE' | 'TROLL'
// type TRANSACTION_STATUSES_TYPES = 'pending' | 'completed' | 'failed'