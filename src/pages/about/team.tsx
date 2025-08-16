import { Link } from "react-router-dom";
import SectionHeading, {
	SectionHeadingProps,
} from "@/components/section-heading";
import TeamMember1 from "@/assets/images/team-member-1.png";
import TeamMember2 from "@/assets/images/team-member-2.png";
import TeamMember3 from "@/assets/images/team-member-3.png";

// Define the type for a team member
interface TeamMember {
	memberImg: string;
	memberName: string;
	memberRole: string;
	memberEmail: string;
}

// Define the type for the TeamMemberCard props
interface TeamMemberCardProps {
	memberImg: string;
	memberName: string;
	memberRole: string;
	memberEmail: string;
}

const Team = () => {
	const sectionHeadingProp: SectionHeadingProps = {
		title: "Meet Our Management Team",
		description: "",
	};

	const teamMembers: TeamMember[] = [
		{
			memberImg: TeamMember1,
			memberName: "Masum Chokder",
			memberRole: "CEO & Founder",
			memberEmail: "ceo@dpmsign.com",
		},
		{
			memberImg: TeamMember2,
			memberName: "Mofijuddin Chokder",
			memberRole: "Managing Director",
			memberEmail: "info@dpmsign.com",
		},
		{
			memberImg: TeamMember3,
			memberName: "Robiul Chokder",
			memberRole: "Head of Marketing",
			memberEmail: "robiul@dpmsign.com",
		},
	];

	return (
		<section className="mt-8 py-6 bg-transparent relative overflow-hidden backdrop:blur-[250px] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-gradient-to-r before:from-[#24a9e2] before:to-[#2c3691] before:opacity-70 before:-z-[1] before:backdrop:blur-[250px] after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:opacity-50 after:-z-[1] after:backdrop:blur-[250px] after:bg-shapesBg">
			<SectionHeading
				title={sectionHeadingProp.title}
				description={sectionHeadingProp.description}
				variant="white"
			/>

			<div className="row grid grid-cols-1 grid-rows-3 xl:grid-cols-3 xl:grid-rows-1 gap-40 xl:gap-4 place-items-center h-auto py-10 pt-28">
				{teamMembers.map((member, index) => (
					<TeamMemberCard
						key={index}
						memberImg={member.memberImg}
						memberName={member.memberName}
						memberRole={member.memberRole}
						memberEmail={member.memberEmail}
					/>
				))}
			</div>
		</section>
	);
};

const TeamMemberCard = ({
	memberImg,
	memberName,
	memberRole,
	memberEmail,
}: TeamMemberCardProps) => {
	return (
		<div className="min-w-96 h-auto flex items-center justify-center gap-6 flex-col bg-[#ffffff70] rounded-3xl relative team-card team-card-1">
			<div className="w-[16.5rem] h-[16.5rem] lg:w-[17rem] lg:h-[17rem] rounded-[50%] flex items-baseline justify-center border-[0.25rem] border-white overflow-hidden absolute top-[-100px] left-[50%] translate-x-[-50%]">
				<img className="" src={memberImg} alt={memberName} />
			</div>
			<div className="w-full h-auto flex items-center justify-center flex-col gap-2 py-8 mt-40">
				<h3 className="text-2xl font-semibold">{memberName}</h3>
				<h4 className="text-xl font-normal">{memberRole}</h4>
				<Link
					to={"mailto:" + memberEmail}
					className="text-lg font-medium font-manrope"
				>
					{memberEmail}
				</Link>
			</div>
		</div>
	);
};

export default Team;
