import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import LeaderCard from '@/components/leadership/LeaderCard';
import BiographyDialog from '@/components/leadership/BiographyDialog';
import { leadershipData } from '@/constant/leadershipData';
import AppHeading from '@/components/common/AppHeading';

const OurLeadership = () => {
  return (
    <div className="w-full p-4">
      <AppHeading
        title="Our Leadership Team"
        description="Meet the visionary leaders driving DFCCIL's mission forward with excellence and innovation"
      />

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {leadershipData.map((leader, index) => (
            <Dialog key={leader.id}>
              <DialogTrigger asChild>
                <div className="h-full transition-all duration-700" style={{ animationDelay: `${index * 0.1}s` }}>
                  <LeaderCard leader={leader} />
                </div>
              </DialogTrigger>
              <BiographyDialog leader={leader} />
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurLeadership;
