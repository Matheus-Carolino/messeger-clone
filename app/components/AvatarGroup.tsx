'use client';

import Image from "next/image";
import { FullConversationType } from "../types";

interface AvatarGroupProps {
    groupImage?: string | null;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
    groupImage
}) => {
    return(
        <div
            className="
                relative
                inline-block
                rounded-full
                overflow-hidden
                h-9
                w-9
                md:h-11
                md:w-11
            "
        >
            <Image 
                alt="Avatar Group"
                src={groupImage || '/images/placeholder.jpg'}
                fill
            />
        </div>
    )
}

export default AvatarGroup