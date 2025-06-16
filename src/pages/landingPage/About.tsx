import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const principles = [
  {
    name: "Work Ethics",
    image: "https://img.icons8.com/color/96/000000/handshake.png",
  },
  {
    name: "Craftsmanship",
    image: "https://img.icons8.com/color/96/000000/paint-brush.png",
  },
  {
    name: "Legacy",
    image: "https://img.icons8.com/color/96/000000/trophy.png",
  },
  {
    name: "Exclusivity",
    image: "https://img.icons8.com/color/96/000000/diamond.png",
  },
  {
    name: "Sustainability",
    image: "https://img.icons8.com/color/96/000000/earth-planet.png",
  },
];

const directors = [
  {
    name: "Ravi Mohan Sethi",
    position: "Founder & Chairman",
    image: "https://www.infostellar.com/Front/img/team1.jpg",
    description:
      "Chairman and promoter of the Group, Mr. Ravi Mohan Sethi has over 17 years of experience in the Banking industry. He is also the Chairman of Citizen Co-operative Bank Ltd, Noida. A former Indian Administrative Service (IAS) officer, while in Government, Mr. Sethi held key senior positions in the bureaucracy including MD, Uttar Pradesh Financial Corporation; Director, Ministry of Industry etc. He is a Hubert H. Humphrey Fellow (Boston University) and holds an MA in Political Science from Allahabad University.",
    quote:
      "Stellar Sigma is a name that has always echoed magnificence, whatever be the endeavour.",
    initials: "RMS",
    badges: ["IAS Officer", "Banking Expert", "Leadership"],
  },
  {
    name: "Mr. Himanshu Mathur",
    position: "Director",
    image: "https://www.infostellar.com/Front/img/team2.jpg",
    description:
      "Mr. Himanshu Mathur has been with the Group since its inception. He previously worked with a State owned Public Finance Institution (PICUP) and the Noida Development Authority. Prior to that, he practiced as a Chartered Accountant, including handling IPOs for two companies. He has over 25 years of financial experience.",
    quote:
      "Excellence is not just our standard, it's our commitment to every client.",
    initials: "PS",
    badges: ["Director", "PICUP", "IPOs"],
  },
  {
    name: "Mr. Akshay Mohan Sethi",
    position: "Director",
    image: "https://www.infostellar.com/Front/img/team3.jpg",
    description:
      "Mr. Akshay has returned to the Group after working as a strategy consultant at McKinsey & Company in their New York office and prior to that working as an analyst at the World Bank in Washington D.C. He holds an MBA from University of Chicago, and an Industrial Engineer degree from Bangalore University.",
    quote:
      "Quality is never an accident; it is always the result of intelligent effort.",
    initials: "AK",
    badges: ["Director", "MBA", "Analyst"],
  },
  {
    name: "Mr. Abu Torab",
    position: "President",
    image: "https://www.infostellar.com/Front/img/team4.jpg",
    description:
      "Mr. Abu Torab has over 20 year experience in IT service (Banking) Industry. He worked as an IT Consultant in Various UCB/DCB/RRB. He has Expertise in the Banking Domain. He holds a MCA degree from Jamia Millia Islamia University, Delhi.",
    quote:
      "Innovation distinguishes between a leader and a follower in luxury real estate.",
    initials: "SV",
    badges: ["Bankink", "MCA", "Innovation"],
  },
];



const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            At <span className="font-bold text-blue-700">Stellar Sigma</span>,
            we represent excellence in luxury real estate development. Stellar
            Sigma 4 in Greater Noida was developed by Stellar Group, which has
            established a strong presence in the real estate sector in Noida and
            Greater Noida. Founded in 1996 by Ravi Mohan Sethi, we continue to
            set new standards in luxury living.
          </p>
        </section>

        {/* Leadership Team */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet the visionaries who drive our commitment to excellence and
              innovation in luxury real estate.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {directors.map((director) => (
              <Card
                key={director.name}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30"
              >
                <CardHeader className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="w-32 h-32 border-4 border-blue-200 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <AvatarImage src={director.image} alt={director.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                        {director.initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-blue-800">
                      {director.name}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-blue-600">
                      {director.position}
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {director.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Card className="border-l-4 border-l-blue-500 bg-blue-50 shadow-sm">
                    <CardContent className="pt-4">
                      <blockquote className="text-blue-800 font-medium italic text-center">
                        "{director.quote}"
                      </blockquote>
                    </CardContent>
                  </Card>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {director.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Vision */}
        {/* Vision */}
        <section className="text-center space-y-8">
          <h2 className="text-4xl font-bold text-blue-700">
            Our Vision & Expertise
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Real Estate Vision */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800 flex items-center justify-center gap-3">
                  <img
                    src="https://img.icons8.com/color/48/000000/building.png"
                    alt="Real Estate"
                    className="w-8 h-8"
                  />
                  Real Estate Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We aim to redefine luxury real estate by launching an array of
                  ultra-luxury commercial and residential projects. Aspiring to
                  become the nation's foremost luxury developer, we're committed
                  to crafting exceptional spaces and reshaping skylines as we
                  expand to new cities.
                </p>
              </CardContent>
            </Card>

            {/* IT & Banking Expertise */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800 flex items-center justify-center gap-3">
                  <img
                    src="https://img.icons8.com/color/48/000000/computer.png"
                    alt="IT Services"
                    className="w-8 h-8"
                  />
                  Technology & Banking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-blue-700">
                    Stellar Informatics (P) Ltd
                  </span>{" "}
                  serves as the IT arm of our established Stellar Group,
                  specializing in Information Technology, Hospitality,
                  Entertainment, and Software Technology Parks. We focus on
                  developing specialized products for Banking and Financial
                  sectors with deep domain expertise across Commercial, Social,
                  Rural, Co-operative, Micro finance, and Agricultural Banking.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Group Overview */}
          <Card className="max-w-5xl mx-auto border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800 flex items-center justify-center gap-3">
                <img
                  src="https://img.icons8.com/color/48/000000/organization.png"
                  alt="Group"
                  className="w-8 h-8"
                />
                Stellar Group Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                The Stellar Group encompasses diverse sectors including{" "}
                <span className="font-semibold text-blue-700">
                  Information Technology
                </span>
                ,
                <span className="font-semibold text-blue-700">
                  {" "}
                  Hospitality & Entertainment
                </span>
                ,
                <span className="font-semibold text-blue-700">
                  {" "}
                  Real Estate Development
                </span>
                , and
                <span className="font-semibold text-blue-700">
                  {" "}
                  Construction
                </span>
                . Our comprehensive approach combines technological innovation
                with luxury development, backed by domain professionals who
                bring extensive knowledge across all banking verticals.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Principles */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">
              Our Principles
            </h2>
            <p className="text-lg text-muted-foreground">
              The core values that guide every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {principles.map((principle) => (
              <Card
                key={principle.name}
                className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 shadow-md"
              >
                <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <img
                      src={principle.image}
                      alt={principle.name}
                      className="w-12 h-12"
                    />
                  </div>
                  <h3 className="font-semibold text-blue-700 text-lg">
                    {principle.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
