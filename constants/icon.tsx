import { Feather } from "@expo/vector-icons";

export const icon = {
    index: (props: String) => <Feather name='home' size={20}  {...props}/>,
    heatMap: (props: String) => <Feather name='map' size={20}  {...props}/>, 
    graphs: (props: String) => <Feather name='activity' size={20}  {...props}/>,
      
}